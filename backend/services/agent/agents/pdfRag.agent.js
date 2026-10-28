import fs from "fs"

import {
    extractTextFromPdf
} from "../services/pdf/pdfService.js"

import {
    chunkText
} from "../services/pdf/chunkService.js"

import {
    embedTexts
} from "../services/pdf/embeddingService.js"

import {
    addChunks,
    deleteDocumentVectors
} from "../services/pdf/vectorStore.js"

import {
    answerQuestion,
    summarizeDocument,
    analyzeDocument,
    generateImportantQuestions,
    analyzeThenAnswer
} from "../services/pdf/ragService.js"

import {
    deductCredits
} from "../utils/deductCredits.js"

import {
    checkAgentLimit
} from "../config/agentLimit.js"



export const pdfRag =
async (state) => {

    // Unique ID for this upload
    const docId =
        `${state.conversationId}-${Date.now()}`


    try {

        console.log(
            "=================================="
        )

        console.log(
            "PDF RAG STARTED"
        )

        console.log(
            "PDF FILE:",
            state.file?.originalname
        )

        console.log(
            "PDF PROMPT:",
            state.prompt
        )


        // ==================================
        // CHECK LIMIT
        // ==================================

        await checkAgentLimit(
            state.userId,
            "pdf"
        )


        // ==================================
        // CHECK FILE
        // ==================================

        if (!state.file) {

            return {

                ...state,

                aiResponse:
                    "No PDF file received."

            }

        }


        // ==================================
        // READ FILE
        // ==================================

        const buffer =
            fs.readFileSync(
                state.file.path
            )


        // ==================================
        // PDF PARSE
        // ==================================

        const {
            text,
            pageCount
        } =
            await extractTextFromPdf(
                buffer
            )


        console.log(
            "PDF PAGE COUNT:",
            pageCount
        )


        console.log(
            "PDF TEXT LENGTH:",
            text.length
        )


        // ==================================
        // EMPTY / SCANNED PDF
        // ==================================

        if (
            !text ||
            text.trim().length <
            50
        ) {

            return {

                ...state,

                aiResponse:
                    "I could not extract readable text from this PDF. It may be a scanned or image-only PDF."

            }

        }


        // ==================================
        // CHUNK PDF
        // ==================================

        const chunks =
            chunkText(
                text,
                1200,
                150
            )


        console.log(
            "PDF CHUNKS:",
            chunks.length
        )


        // ==================================
        // CREATE EMBEDDINGS
        // ==================================

        console.log(
            "Creating embeddings..."
        )


        const embeddings =
            await embedTexts(

                chunks.map(
                    chunk =>
                        chunk.text
                )

            )


        console.log(
            "Embeddings created:",
            embeddings.length
        )


        console.log(
            "Embedding dimension:",
            embeddings[0]?.length
        )


        // ==================================
        // ADD EMBEDDINGS TO CHUNKS
        // ==================================

        const embeddedChunks =
            chunks.map(

                (chunk, index) => ({

                    ...chunk,

                    embedding:
                        embeddings[index]

                })

            )


        // ==================================
        // STORE IN LANCEDB
        // ==================================

        await addChunks(
            docId,
            embeddedChunks
        )


        console.log(
            "PDF indexed in LanceDB"
        )


        // ==================================
        // UNDERSTAND USER REQUEST
        // ==================================

        const originalPrompt =
            (
                state.prompt ||
                ""
            ).trim()


        const prompt =
            originalPrompt
                .toLowerCase()


        let aiResponse


        // ----------------------------------
        // FIRST ANALYZE + ANSWER
        // ----------------------------------

        const wantsAnalysisFirst =

            prompt.includes(
                "first analyze"
            ) ||

            prompt.includes(
                "first analyse"
            ) ||

            prompt.includes(
                "analyze first"
            ) ||

            prompt.includes(
                "analyse first"
            ) ||

            prompt.includes(
                "first summarize"
            ) ||

            prompt.includes(
                "first summarise"
            )


        // ----------------------------------
        // IMPORTANT QUESTIONS
        // ----------------------------------

        const wantsQuestions =

            prompt.includes(
                "important question"
            ) ||

            prompt.includes(
                "important questions"
            ) ||

            prompt.includes(
                "exam question"
            ) ||

            prompt.includes(
                "exam questions"
            ) ||

            prompt.includes(
                "generate questions"
            )


        // ----------------------------------
        // SUMMARY
        // ----------------------------------

        const wantsSummary =

            prompt.includes(
                "summarize"
            ) ||

            prompt.includes(
                "summarise"
            ) ||

            prompt ===
            "summary"


        // ----------------------------------
        // ANALYSIS
        // ----------------------------------
        // Was previously an exact-match list (e.g. only the literal string
        // "explain this pdf" worked). Switched to substring matching so
        // natural variations/typos — "explain itt", "analyse it", "analysis"
        // — all correctly trigger analysis mode instead of silently falling
        // through to Q&A with the raw command as the "question".

        const wantsAnalysis =

            !prompt ||

            prompt.includes(
                "explain"
            ) ||

            prompt.includes(
                "analy"
            ) // matches analyze / analyse / analysis, any spelling/typo



        // ==================================
        // CHOOSE PDF MODE
        // ==================================

        if (
            wantsAnalysisFirst
        ) {

            console.log(
                "PDF MODE: ANALYZE + ANSWER"
            )


            aiResponse =
                await analyzeThenAnswer(

                    docId,

                    text,

                    chunks,

                    originalPrompt

                )

        }


        else if (
            wantsQuestions
        ) {

            console.log(
                "PDF MODE: IMPORTANT QUESTIONS"
            )


            aiResponse =
                await generateImportantQuestions(

                    text,

                    chunks

                )

        }


        else if (
            wantsSummary
        ) {

            console.log(
                "PDF MODE: SUMMARY"
            )


            aiResponse =
                await summarizeDocument(

                    text,

                    chunks

                )

        }


        else if (
            wantsAnalysis
        ) {

            console.log(
                "PDF MODE: ANALYSIS"
            )


            aiResponse =
                await analyzeDocument(

                    text,

                    chunks

                )

        }


        else {

            console.log(
                "PDF MODE: QUESTION ANSWERING"
            )


            aiResponse =
                await answerQuestion(

                    docId,

                    originalPrompt

                )

        }


        // ==================================
        // DEDUCT CREDIT
        // ==================================

        await deductCredits(
            state.userId,
            "pdf"
        )


        // ==================================
        // RESPONSE
        // ==================================

        return {

            ...state,

            aiResponse

        }


    }


    catch (error) {

        console.log(
            "PDF RAG ERROR:",
            error
        )


        return {

            ...state,

            aiResponse:

                error?.message ||

                "Failed to analyze PDF."

        }

    }


    finally {

        // ==================================
        // REMOVE TEMP PDF
        // ==================================

        try {

            if (
                state.file?.path &&
                fs.existsSync(
                    state.file.path
                )
            ) {

                fs.unlinkSync(
                    state.file.path
                )

            }

        }

        catch (error) {

            console.log(
                "PDF temp delete error:",
                error.message
            )

        }


        // ==================================
        // CLEAN VECTOR DB FOR THIS REQUEST
        // ==================================

        try {

            await deleteDocumentVectors(
                docId
            )

        }

        catch (error) {

            console.log(
                "Vector cleanup error:",
                error.message
            )

        }

    }

}