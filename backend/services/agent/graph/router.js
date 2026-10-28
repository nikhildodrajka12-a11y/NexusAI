import { getModel } from "../config/llmModels.js"


export const router = async (state) => {


    // =====================================
    // 1. FILE HAS HIGHEST PRIORITY
    // =====================================

    if (state.file) {


        // ---------------------------------
        // PDF FILE
        // ---------------------------------

        if (
            state.file.mimetype ===
            "application/pdf"
        ) {

            return {

                ...state,

                agent: "pdfRag"

            }

        }


        // ---------------------------------
        // IMAGE FILE
        // ---------------------------------

        if (
            state.file.mimetype &&
            state.file.mimetype.startsWith("image/")
        ) {

            return {

                ...state,

                agent: "imageAnalyzer"

            }

        }

    }


    // =====================================
    // 2. MANUAL AGENT SELECTION
    // =====================================

    if (
        state.agent &&
        state.agent !== "auto"
    ) {

        return {

            ...state,

            agent: state.agent

        }

    }


    // =====================================
    // 3. AUTO ROUTING
    // =====================================

    const llm = await getModel("router")


    const prompt = `You are an agent router.

Available agents:

- chat
- search
- coding
- pdf
- ppt
- vision

Rules:

chat:
General conversation,
explanations,
learning,
questions.

search:
Current events,
latest information,
news,
recent developments,
internet lookup.

coding:
Generate code,
debug code,
build projects,
architecture,
API design.

pdf:
Generate PDFs or documents.

ppt:
Generate PowerPoint presentations.

vision:
Generate images.

Return ONLY one word:

chat
search
coding
pdf
ppt
vision

User Query:
${state.prompt || ""}
`


    const response = await llm.invoke(prompt)


    const selectedAgent =
        response.content
            .trim()
            .toLowerCase()


    return {

        ...state,

        agent: selectedAgent

    }

}