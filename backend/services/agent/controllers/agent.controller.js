import axios from "axios"

import {
  graph
} from "../graph/graph.js"

import {
  addMessage
} from "../config/memory.js"


export const agent =
  async (
    req,
    res,
    next
  ) => {

    try {

      const {
        prompt,
        conversationId,
        agent
      } = req.body


      const file =
        req.file


      const userId =
        req.headers[
          "x-user-id"
        ]


      console.log(
        "\n========== AGENT REQUEST =========="
      )


      console.log(
        "Prompt:",
        prompt
      )


      console.log(
        "Conversation:",
        conversationId
      )


      console.log(
        "Selected Agent:",
        agent
      )


      console.log(
        "User ID:",
        userId
      )


      console.log(
        "File:",
        file
          ? {
              originalname:
                file.originalname,

              mimetype:
                file.mimetype,

              path:
                file.path,

              size:
                file.size
            }
          : null
      )


      // =================================
      // SAVE USER MESSAGE
      // =================================

      await axios.post(

        `${process.env.CHAT_SERVICE}/save-message`,

        {

          conversationId,

          role:
            "user",

          content:
            prompt || ""

        }

      )


      // =================================
      // LANGGRAPH
      // =================================

      const result =
        await graph.invoke({

          prompt:
            prompt || "",

          conversationId,

          agent:
            agent || "auto",

          userId,

          file

        })


      console.log(
        "GRAPH RESULT:",
        result
      )


      // =================================
      // REDIS MEMORY
      // =================================

      await addMessage(

        conversationId,

        "user",

        prompt || ""

      )


      await addMessage(

        conversationId,

        "assistant",

        result.aiResponse || ""

      )


      // =================================
      // SAVE AI MESSAGE
      // =================================

      await axios.post(

        `${process.env.CHAT_SERVICE}/save-message`,

        {

          conversationId,

          role:
            "assistant",

          content:
            result.aiResponse,

          images:
            result.images,

          artifacts:
            result.artifacts

        }

      )


      // =================================
      // RESPONSE
      // =================================

      return res
        .status(200)
        .json({

          answer:
            result.aiResponse ||
            "No response generated.",

          images:
            result.images || [],

          artifacts:
            result.artifacts || []

        })

    } catch (error) {

      console.error(

        "\n========== AGENT ERROR =========="
      )


      console.error(
        error
      )


      next(
        error
      )

    }

  }