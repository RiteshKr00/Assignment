const multer = require("multer");
const storage = multer.memoryStorage();

function uploadFile(req, res, next) {
  const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 10 }, //10MB
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "application/pdf"
      ) {
        cb(null, true);
      } else {
        cb(
          new Error(
            "Invalid file type. Only JPG and png and PDFs are allowed."
          ),
          false
        );
      }
    },
  }).single("image");

  upload(req, res, function (err) {
    if (err) {
      return res.status(400).json({
        error: err.message,
      });
    }
    next();
  });
}
module.exports = uploadFile;
