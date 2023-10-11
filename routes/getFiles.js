const express = require("express");
const router = express.Router();
const Files = require("../models/filesModel");

router.get("/:fileId", async (req, res) => {
  console.log("first");
  try {
    console.log(req.params.fileId);
    const file = await Files.findOne({ fileId: req.params.fileId });
    if (!file)
      return res
        .status(404)
        .json({ message: "No Files found with given Link" });

    if (file) {
      //check for expiry
      if (file.expiresAt <= Date.now())
        return res.status(410).json({ message: "Files Link is expired" });

      let contentType = "";
      let contentDisposition = "";
      if (file.fileType === "image/png") {
        contentType = "image/png";
        contentDisposition = `attachment; filename=Download.png`;
      } else if (
        file.fileType === "image/jpg" ||
        file.fileType === "image/jpeg"
      ) {
        contentType = "image/jpg";
        contentDisposition = `attachment; filename=Download.png`;
      } else if (file.fileType === "application/pdf") {
        contentType = "application/pdf";
        contentDisposition = `attachment; filename=Download.pdf`;
      } else {
        return res.status(400).json({ message: "Unsupported file type" });
      }

      // Set response headers and send the appropriate file
      res.set({
        "Content-Type": contentType,
        "Content-Disposition": contentDisposition,
      });

      res.end(file.file, "binary"); //reading format
    } else {
      return res.status(404).json({ message: "File not found" });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error + ${error.message}` });
  }
});
module.exports = router;
