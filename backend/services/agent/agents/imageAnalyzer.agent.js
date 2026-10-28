import { HumanMessage, SystemMessage } from "@langchain/core/messages"
import { getModel } from "../config/llmModels.js"
import fs from "fs/promises"
import { deductCredits } from "../utils/deductCredits.js"
import { checkAgentLimit } from "../config/agentLimit.js"

export const imageAnalyzer = async (state) => {

    try {

        await checkAgentLimit(state.userId, "image")

        // Check file
        if (!state.file) {
            return {
                ...state,
                aiResponse: "No image file received."
            }
        }

        const llm = await getModel("imageAnalyzer")

        const imageBuffer = await fs.readFile(state.file.path)

        const base64Image = imageBuffer.toString("base64")

        const messages = [

            new SystemMessage(
                `You are NexusAI Image Analyzer Agent.

Rules:

- Analyze only the uploaded image.
- Answer the user's question accurately.
- If text exists in the image, extract it.
- If charts or tables exist, explain them.
- If something is unclear, say so.
- Use Markdown when helpful.
- Do not hallucinate.
`
            ),

            new HumanMessage({

                content: [

                    {
                        type: "text",
                        text: state.prompt || "Analyze this image in detail."
                    },

                    {
                        type: "image_url",
                        image_url: {
                            url: `data:${state.file.mimetype};base64,${base64Image}`
                        }
                    }

                ]

            })

        ]

        const response = await llm.invoke(messages)

        await deductCredits(state.userId, "vision")

        return {

            ...state,

            aiResponse:
                typeof response.content === "string"
                    ? response.content
                    : JSON.stringify(response.content)

        }

    } catch (error) {

        console.log("IMAGE ANALYZER ERROR:", error)

        return {

            ...state,

            aiResponse:
                error?.message ||
                "Failed to analyze image."

        }

    } finally {

        try {

            if (state.file?.path) {

                await fs.unlink(state.file.path)

            }

        } catch (unlinkError) {

            console.log(
                "Failed to delete temporary image:",
                unlinkError.message
            )

        }

    }

}