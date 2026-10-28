import {
    GoogleGenerativeAIEmbeddings
} from "@langchain/google-genai"


const embeddings =
    new GoogleGenerativeAIEmbeddings({

        model:
            "gemini-embedding-001",

        apiKey:
            process.env.GOOGLE_API_KEY

    })



export const embedText =
async (text) => {

    if (
        !text ||
        !text.trim()
    ) {

        throw new Error(
            "Cannot create embedding for empty text"
        )

    }


    const vector =
        await embeddings.embedQuery(
            text
        )


    if (
        !Array.isArray(vector) ||
        vector.length === 0
    ) {

        throw new Error(
            "Gemini returned an empty embedding"
        )

    }


    return vector
}



export const embedTexts =
async (texts) => {

    if (
        !Array.isArray(texts) ||
        texts.length === 0
    ) {

        return []

    }


    const cleanTexts =
        texts.filter(
            text =>
                text &&
                text.trim()
        )


    // NOTE: gemini-embedding-001 has a known bug in @langchain/google-genai
    // where embedDocuments() silently returns an EMPTY vector for every item
    // when given more than one text in a single call (no error is thrown —
    // it just comes back broken). Embedding one chunk at a time via the
    // already-working embedText()/embedQuery() path avoids it entirely.
    const vectors = []

    for (const text of cleanTexts) {

        // eslint-disable-next-line no-await-in-loop
        const vector = await embedText(text)
        vectors.push(vector)

    }


    return vectors
}



export const testEmbedding =
async () => {

    const vector =
        await embedText(
            "NexusAI PDF test"
        )


    console.log(
        "Embedding dimensions:",
        vector.length
    )


    return vector.length
}