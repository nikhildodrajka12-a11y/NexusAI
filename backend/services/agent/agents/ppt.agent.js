import { getModel } from "../config/llmModels.js"
import { generatePpt } from "../utils/generatePpt.js"
import { getFromS3 } from "../utils/getFromS3.js"
import { uploadToS3 } from "../utils/uploadToS3.js"
import { deductCredits } from "../utils/deductCredits.js"
import { checkAgentLimit } from "../config/agentLimit.js"
import { getPreviousArtifact } from "../utils/getPreviousArtifact.js"

// Detects a follow-up like "add this flowchart to it" / "add this image on
// itt" — as opposed to a request to generate a brand new deck.
function wantsAddToExisting(prompt) {
    const p = (prompt || "").toLowerCase().trim()
    if (!p.includes("add")) return false

    return (
        p.includes(" it") ||
        p.includes("itt") ||
        p.includes("this ppt") ||
        p.includes("this presentation") ||
        p.includes("this deck") ||
        p.includes("presentation") ||
        p.includes("deck")
    )
}

async function buildAndUploadPpt(data) {
    const ppt = await generatePpt(data)
    const buffer = await ppt.write({ outputType: "nodebuffer" })
    const filename = `ppt-${Date.now()}.pptx`

    await uploadToS3(
        filename,
        buffer,
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    )

    const downloadUrl = await getFromS3(filename, 24 * 60 * 60)
    return { filename, downloadUrl }
}

function buildArtifact(filename, data) {
    return [
        {
            id: Date.now(),
            type: "ppt",
            title: data.title,
            files: [
                {
                    name: filename,
                    content: JSON.stringify(data),
                },
            ],
        },
    ]
}

export const pptAgent = async (state) => {
    try {
        await checkAgentLimit(state.userId, "ppt")
        const llm = await getModel("ppt")
        const isImageFile = state.file && state.file.mimetype?.startsWith("image/")

        // ---------------------------------------------------------
        // EDIT MODE: "add this flowchart/image to it"
        // ---------------------------------------------------------
        if (wantsAddToExisting(state.prompt)) {
            const previousData = await getPreviousArtifact(state.conversationId, "ppt")

            if (!previousData) {
                return {
                    ...state,
                    aiResponse:
                        "I couldn't find a previously generated presentation in this conversation to add to. Generate a new one first, then ask me to add to it.",
                }
            }

            let newSlide

            if (isImageFile) {
                newSlide = {
                    type: "image",
                    title: "Added Image",
                    imagePath: state.file.path,
                }
            } else {
                const flowchartPrompt = `You are a professional presentation designer.

The presentation is titled "${previousData.title}".

Based on this request, generate ONE flowchart slide as JSON only:

{
"title":"",
"steps":["","",""]
}

Rules:
- 3 to 7 short, ordered step labels (a few words each).
- No markdown, no explanation, no code block. Return ONLY JSON.

Request:

${state.prompt}`

                const res = await llm.invoke(flowchartPrompt)
                const flowchartData = JSON.parse(res.content)

                newSlide = {
                    type: "flowchart",
                    title: flowchartData.title,
                    steps: flowchartData.steps,
                }
            }

            const updatedData = {
                ...previousData,
                slides: [...(previousData.slides || []), newSlide],
            }

            await deductCredits(state.userId, "ppt")
            const { filename, downloadUrl } = await buildAndUploadPpt(updatedData)

            return {
                ...state,
                aiResponse: `# ✅ Presentation Updated

**${updatedData.title}**

📥 [Download PPT](${downloadUrl})

_Link expires in 24 hours._`,
                artifacts: buildArtifact(filename, updatedData),
            }
        }

        // ---------------------------------------------------------
        // NORMAL MODE: generate a brand new deck
        // ---------------------------------------------------------
        const prompt = `You are a professional presentation designer.

Return ONLY valid JSON.

Format:

{
"title":"",
"subtitle":"",
"slides":[
{
"type":"bullets",
"title":"",
"points":["","","",""]
}
]
}

Rules:

- Generate exactly 6 content slides.
- Each slide should have 4-6 concise bullet points.
- Set "type" to "flowchart" instead of "bullets" for any slide that describes
  a process, workflow, or ordered sequence of steps. For those slides, use
  "steps":["","",""] (3-7 short ordered step labels) instead of "points".
- No markdown.
- No explanation.
- No code block.
- Return ONLY JSON.

Topic:

${state.prompt}`

        const res = await llm.invoke(prompt)
        const data = JSON.parse(res.content)
        await deductCredits(state.userId, "ppt")

        // If the user attached an image alongside a fresh generation
        // request, tack it on as its own slide too.
        if (isImageFile) {
            data.slides = [
                ...(data.slides || []),
                {
                    type: "image",
                    title: "Added Image",
                    imagePath: state.file.path,
                },
            ]
        }

        const { filename, downloadUrl } = await buildAndUploadPpt(data)

        return {
            ...state,
            aiResponse: `# ✅ Presentation Generated

**${data.title}**

📥 [Download PPT](${downloadUrl})

_Link expires in 24 hours._`,
            artifacts: buildArtifact(filename, data),
        }

    } catch (error) {
        console.log(error)
        return {
            ...state,
            aiResponse: error?.data?.message || "failed to generate ppt"
        }
    }
}