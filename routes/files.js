const express = require("express");
const router = express.Router();
require("dotenv").config();
const { nanoid } = require("nanoid");
const Files = require("../models/filesModel");
const isAuthenticated = require("../middlewares/authJwt");
const hashing = require("../utils/hashing");
const base = process.env.base_url;
const filesUpload = require("../utils/fileUploads");
const File = require("../models/filesModel");
router.post("/upload", isAuthenticated, filesUpload, async (req, res) => {
  try {
    console.log("first");
    if (req.file == undefined) {
      return res.json({ message: `You must select a file.` });
    }
    const fileType = req.file.mimetype;
    const fileId = hashing();
    const shortUrl = `${base}/${fileId}`;
    const fileData = {
      fileId: fileId,
      file: req.file.buffer,
      shortUrl,
      fileType,
      createdBy: req.user._id,
    };
    const createFile = await new Files(fileData).save();

    res.status(200).json({ message: "success", url: shortUrl });
  } catch (error) {
    res.status(500).json({ message: `Server Error + ${error}` });
  }
});
//moved to other file
// router.get("/:fileId", async (req, res) => {
//   try {
//     console.log(req.params.fileId);
//     const file = await Files.findOne({ fileId: req.params.fileId });
//     if (!file)
//       return res
//         .status(404)
//         .json({ message: "No Files found with given Link" });

//     if (file) {
//       //check for expiry
//       if (file.expiresAt <= Date.now())
//         return res.status(410).json({ message: "Files Link is expired" });

//       let contentType = "";
//       let contentDisposition = "";
//       console.log(file);
//       if (file.fileType === "image/png") {
//         contentType = "image/png";
//         contentDisposition = `attachment; filename=Download.png`;
//       } else if (
//         file.fileType === "image/jpg" ||
//         file.fileType === "image/jpeg"
//       ) {
//         contentType = "image/jpg";
//         contentDisposition = `attachment; filename=Download.png`;
//       } else if (file.fileType === "application/pdf") {
//         contentType = "application/pdf";
//         contentDisposition = `attachment; filename=Download.pdf`;
//       } else {
//         return res.status(400).json({ message: "Unsupported file type" });
//       }

//       // Set response headers and send the appropriate file
//       res.set({
//         "Content-Type": contentType,
//         "Content-Disposition": contentDisposition,
//       });

//       res.end(file.file, "binary"); //reading format
//     } else {
//       return res.status(404).json({ message: "File not found" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: `Server Error + ${error.message}` });
//   }
// });

router.delete("/:fileId", isAuthenticated, async (req, res) => {
  try {
    const deletedFile = await Files.findByIdAndDelete(req.params.fileId);
    if (!deletedFile) {
      return res.status(404).json({ message: "File not found" });
    }
    return res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: `Server Error + ${error.message}` });
  }
});

module.exports = router;
