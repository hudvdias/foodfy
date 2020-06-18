const multer = require("multer")

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./public/images")
    },
    filename: (req, file, callback) => {
        callback(null, `${Date.now().toString()}-${file.originalname}`)
    }
})

const fileFilter = (req, file, callback) => {
    const accepted = ["image/png", "image/jpg", "image/jpeg"].find(format => format == file.mimetype)
    if(accepted) return callback(null, true)
    return callback(null, false)
}

module.exports = multer({storage, fileFilter})