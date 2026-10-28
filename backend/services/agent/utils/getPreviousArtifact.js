import axios from "axios"

// Fetches the most recent assistant message in a conversation that carries
// an artifact of the given type (e.g. "ppt"), and returns its parsed
// structured content. Used for "add this to it" follow-up edits, so we can
// modify the previously generated deck/doc instead of starting from scratch.
export const getPreviousArtifact = async (conversationId, type) => {
    try {
        const { data } = await axios.get(
            `${process.env.CHAT_SERVICE}/get-messages/${conversationId}`
        )

        const messagesWithArtifact = (data || []).filter(
            (m) =>
                m.role === "assistant" &&
                Array.isArray(m.artifacts) &&
                m.artifacts.some((a) => a.type === type)
        )

        if (messagesWithArtifact.length === 0) return null

        const last = messagesWithArtifact[messagesWithArtifact.length - 1]
        const artifact = last.artifacts.find((a) => a.type === type)
        const file = artifact?.files?.[0]

        if (!file?.content) return null

        return JSON.parse(file.content)
    } catch (error) {
        console.log("getPreviousArtifact error:", error)
        return null
    }
}