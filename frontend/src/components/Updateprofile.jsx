import api from "../../utils/axios"

// Expects a backend route like: POST /api/me/update  { name }
// returning the updated user object. Add this route on the server if
// it doesn't exist yet — until then this fails silently and the UI
// falls back to an optimistic (session-only) update.
export const updateProfile = async (payload) => {
    try {
        const {data} = await api.post("/api/me/update", payload)
        return data
    } catch (error) {
        console.log(error)
        return null
    }
}