import {
    embedText
} from "./embeddingService.js"

import {
    searchChunks
} from "./vectorStore.js"

import {
    groupChunks
} from "./chunkService.js"

import {
    chatComplete
} from "./llmService.js"



const MAX_DIRECT_CHARS =
    12000



// ==========================================
// RETRIEVE RELEVANT CHUNKS
// ==========================================

export const retrieveRelevantChunks =
async (
    docId,
    query,
    topK = 8
) => {

    const queryEmbedding =
        await embedText(
            query
        )


    const relevant =
        await searchChunks(
            docId,
            queryEmbedding,
            topK
        )


    return relevant
}



const buildContextBlock =
(chunks) => {

    return chunks

        .map(

            chunk =>
                `[PDF Excerpt ${chunk.index}]

${chunk.text}`

        )

        .join(
            "\n\n"
        )

}



// ==========================================
// QUESTION ANSWERING
// ==========================================

export const answerQuestion =
async (
    docId,
    question
) => {

    const relevant =
        await retrieveRelevantChunks(
            docId,
            question,
            8
        )


    if (!relevant.length) {

        return (
            "I couldn't find relevant information in the uploaded PDF."
        )

    }


    const context =
        buildContextBlock(
            relevant
        )


    return chatComplete(

        `You are NexusAI PDF Question Answering Agent.

Rules:

- Answer ONLY using the uploaded PDF excerpts.
- Never invent information.
- Give a clear and useful answer.
- If the answer is not present, say:
  "I couldn't find this information in the uploaded PDF."
- Use Markdown when helpful.`,

        `PDF CONTEXT:

${context}


USER QUESTION:

${question}`

    )
}



// ==========================================
// FULL DOCUMENT SUMMARY
// ==========================================

export const summarizeDocument =
async (
    text,
    chunks
) => {

    // SMALL PDF
    if (
        text.length <=
        MAX_DIRECT_CHARS
    ) {

        return chatComplete(

            `You are NexusAI PDF Summarizer.

Create a complete summary of the uploaded PDF.

Include:
- Document overview
- Main topics
- Important points
- Key findings
- Conclusion

Use only the PDF content.`,

            text

        )

    }


    // LARGE PDF
    // Map → Reduce

    const groups =
        groupChunks(
            chunks,
            6
        )


    const partialSummaries =
        []


    for (
        const group of groups
    ) {

        const groupText =
            group

                .map(
                    chunk =>
                        chunk.text
                )

                .join(
                    "\n\n"
                )


        const partial =
            await chatComplete(

                `Summarize this section of a larger PDF.

Keep:
- important facts
- main concepts
- names
- numbers
- findings
- conclusions

Do not invent information.`,

                groupText

            )


        partialSummaries.push(
            partial
        )

    }


    return chatComplete(

        `You are NexusAI PDF Summarizer.

Combine the section summaries into ONE complete summary.

Use this structure:

# Document Overview

# Main Topics

# Important Points

# Key Findings

# Conclusion

Do not invent information.`,

        partialSummaries.join(
            "\n\n"
        )

    )
}



// ==========================================
// FULL PDF ANALYSIS
// ==========================================

export const analyzeDocument =
async (
    text,
    chunks
) => {

    if (
        text.length <=
        MAX_DIRECT_CHARS
    ) {

        return chatComplete(

            `You are NexusAI PDF Analysis Agent.

Analyze this PDF thoroughly.

Explain:

# Document Overview
# Purpose
# Main Topics
# Important Sections
# Key Concepts
# Important Facts
# Results / Findings
# Problems / Solutions
# Conclusion

Use only PDF content.
Do not hallucinate.
Explain clearly.`,

            text

        )

    }


    const groups =
        groupChunks(
            chunks,
            6
        )


    const analyses =
        []


    for (
        const group of groups
    ) {

        const content =
            group

                .map(
                    chunk =>
                        chunk.text
                )

                .join(
                    "\n\n"
                )


        const analysis =
            await chatComplete(

                `Analyze this section of a larger PDF.

Extract:

- Purpose
- Important concepts
- Important facts
- Arguments
- Findings
- Problems
- Solutions
- Conclusions

Use only the supplied text.`,

                content

            )


        analyses.push(
            analysis
        )

    }


    return chatComplete(

        `Combine these PDF section analyses into one complete document analysis.

Use:

# Document Overview
# Main Purpose
# Main Topics
# Key Concepts
# Important Findings
# Problems / Solutions
# Conclusion

Use only supplied information.`,

        analyses.join(
            "\n\n"
        )

    )
}



// ==========================================
// IMPORTANT QUESTIONS
// ==========================================

export const generateImportantQuestions =
async (
    text,
    chunks
) => {

    let source


    if (
        text.length <=
        MAX_DIRECT_CHARS
    ) {

        source = text

    } else {

        source =
            await summarizeDocument(
                text,
                chunks
            )

    }


    return chatComplete(

        `You are NexusAI Important Question Generator.

Generate important questions ONLY from the uploaded PDF.

Create:

# Important Questions

## Short Answer Questions

## Long Answer Questions

## Conceptual Questions

## Most Important Questions

Do not add topics outside the PDF.`,

        source

    )
}



// ==========================================
// ANALYZE FIRST + ANSWER QUESTION
// ==========================================

export const analyzeThenAnswer =
async (
    docId,
    text,
    chunks,
    userPrompt
) => {

    const analysis =
        await analyzeDocument(
            text,
            chunks
        )


    const relevant =
        await retrieveRelevantChunks(
            docId,
            userPrompt,
            8
        )


    const context =
        buildContextBlock(
            relevant
        )


    const answer =
        await chatComplete(

            `Answer the user's question using ONLY the uploaded PDF context.

Do not hallucinate.`,

            `PDF CONTEXT:

${context}


USER REQUEST:

${userPrompt}`

        )


    return `# PDF Analysis

${analysis}


# Answer to Your Question

${answer}`
}