const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema(
  {
    fileId: {
      type: String,
      required: true,
    },
    file: {
      type: Buffer, // Use Buffer data type to store binary data (BLOB)
      required: true,
    },
    shortUrl: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
const File = mongoose.model("File", FileSchema);
module.exports = File;
