import { createSlice } from "@reduxjs/toolkit"

const getStored = (key, fallback) => {
    try {
        const v = localStorage.getItem(key)
        return v !== null ? JSON.parse(v) : fallback
    } catch (error) {
        return fallback
    }
}

const preferencesSlice = createSlice({
    name: "preferences",
    initialState: {
        theme: getStored("nexusai_theme", "dark"),
        reduceMotion: getStored("nexusai_reduce_motion", false),
        defaultAgent: getStored("nexusai_default_agent", "Auto"),
    },
    reducers: {
        setTheme: (state, action) => {
            state.theme = action.payload
            localStorage.setItem("nexusai_theme", JSON.stringify(action.payload))
        },
        setReduceMotion: (state, action) => {
            state.reduceMotion = action.payload
            localStorage.setItem("nexusai_reduce_motion", JSON.stringify(action.payload))
        },
        setDefaultAgent: (state, action) => {
            state.defaultAgent = action.payload
            localStorage.setItem("nexusai_default_agent", JSON.stringify(action.payload))
        },
    }
})

export const { setTheme, setReduceMotion, setDefaultAgent } = preferencesSlice.actions
export default preferencesSlice.reducer