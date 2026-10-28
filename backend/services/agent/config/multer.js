import multer from "multer"

import fs from "fs"

import path from "path"


const uploadDir =
  "uploads"


if (
  !fs.existsSync(
    uploadDir
  )
) {

  fs.mkdirSync(
    uploadDir,
    {
      recursive:
        true
    }
  )

}


const storage =
  multer.diskStorage({

    destination:
      (req, file, cb) => {

        cb(
          null,
          uploadDir
        )

      },


    filename:
      (req, file, cb) => {

        const uniqueName =
          `${Date.now()}-${Math.round(
            Math.random() *
            1e9
          )}`


        const extension =
          path.extname(
            file.originalname
          )


        cb(

          null,

          `${uniqueName}${extension}`

        )

      }

  })


const multerConfig =
  multer({

    storage,


    limits: {

      fileSize:
        20 *
        1024 *
        1024

    },


    fileFilter:

      (req, file, cb) => {

        const allowedTypes = [

          "application/pdf"

        ]


        if (

          allowedTypes.includes(
            file.mimetype
          ) ||

          file.mimetype.startsWith(
            "image/"
          )

        ) {

          cb(
            null,
            true
          )

        } else {

          cb(
            new Error(
              "Only PDF and image files are allowed."
            )
          )

        }

      }

  })


export default multerConfig