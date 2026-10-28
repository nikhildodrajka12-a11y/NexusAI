import dotenv from "dotenv"

dotenv.config()

import { ChatGroq } from "@langchain/groq"

import {
    ChatGoogleGenerativeAI
} from "@langchain/google-genai"

import {
    ChatOpenRouter
} from "@langchain/openrouter"


// =====================================
// GROQ MODEL
// Chat + Search + PDF RAG
// =====================================

const groq = new ChatGroq({

    model: "openai/gpt-oss-120b"

})


// =====================================
// GEMINI MODEL
// Image Analysis
// =====================================

const gemini = new ChatGoogleGenerativeAI({

    model: "gemini-3.6-flash"

})


// =====================================
// OPENROUTER MODEL
// Coding Agent
// =====================================

const openrouter = new ChatOpenRouter({

    model: "deepseek/deepseek-chat",

    temperature: 0,

    maxTokens: 2500

})


// =====================================
// MODEL ROUTER
// =====================================

export const getModel = async (agent) => {

    switch (agent) {


        // ---------------------------------
        // CHAT
        // ---------------------------------

        case "chat":

            return groq


        // ---------------------------------
        // SEARCH
        // ---------------------------------

        case "search":

            return groq


        // ---------------------------------
        // CODING
        // ---------------------------------

        case "coding":

            return openrouter


        // ---------------------------------
        // IMAGE ANALYZER
        // ---------------------------------

        case "imageAnalyzer":

            return gemini


        // ---------------------------------
        // PDF RAG
        // ---------------------------------

        case "pdf-rag":

            return groq


        // ---------------------------------
        // ROUTER
        // ---------------------------------

        case "router":

            return groq


        // ---------------------------------
        // DEFAULT
        // ---------------------------------

        default:

            return groq

    }

}