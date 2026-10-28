import multer from "multer"
import fs from "fs"
import path from "path"

const tempDir = path.resolve("temp")

if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, {
        recursive: true
    })
}

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, tempDir)
    },

    filename: (req, file, cb) => {

        const safeName =
            `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`

        cb(null, safeName)
    }

})


const fileFilter = (req, file, cb) => {

    const allowedTypes = [

        "application/pdf",

        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp"

    ]

    if (!allowedTypes.includes(file.mimetype)) {

        return cb(
            new Error("Only PDF and image files are allowed"),
            false
        )

    }

    cb(null, true)
}


const upload = multer({

    storage,

    fileFilter,

    limits: {
        fileSize: 20 * 1024 * 1024
    }

})


export default upload