import express from "express"
import dotenv from "dotenv"

import connectDb from "./config/db.js"

import router from "./routes/agent.route.js"


dotenv.config()


const port =
  process.env.PORT


const app =
  express()


app.use(
  express.json()
)


app.use(
  "/",
  router
)


// ======================================
// ERROR HANDLER
// ======================================

app.use(
  (err, req, res, next) => {

    console.error(
      "Agent Error:",
      err
    )


    if (err.status) {

      return res
        .status(err.status)
        .json(

          err.data ||
          {
            message:
              err.message
          }

        )

    }


    return res
      .status(500)
      .json({

        message:

          `Agent error: ${
            err.message ||
            "Unknown error"
          }`

      })

  }
)


app.get(

  "/",

  (req, res) => {

    res.json({

      message:
        "Hello from Agent Service"

    })

  }

)


app.listen(

  port,

  async () => {

    console.log(
      `Agent started at ${port}`
    )


    await connectDb()

  }

)