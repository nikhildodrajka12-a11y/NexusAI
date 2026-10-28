import {
    HumanMessage,
    SystemMessage
} from "@langchain/core/messages"

import {
    getModel
} from "../../config/llmModels.js"



export const chatComplete =
async (
    systemPrompt,
    userPrompt
) => {

    const llm =
        await getModel(
            "pdf-rag"
        )


    const response =
        await llm.invoke([

            new SystemMessage(
                systemPrompt
            ),

            new HumanMessage(
                userPrompt
            )

        ])


    if (
        typeof response.content ===
        "string"
    ) {

        return response.content

    }


    return JSON.stringify(
        response.content
    )
}