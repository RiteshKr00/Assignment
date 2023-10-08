const express = require("express");
const app = express();
const cors = require("cors");
const { connectDB } = require("./config/db");
const getFile = require("./routes/getFiles");
const fileRoutes = require("./routes/files");
const authRoutes = require("./routes/auth");
require("dotenv").config();

//middlewares
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://localhost:3000",
    "https://frontend-assignment-zeta-ivory.vercel.app",
  ], // Replace with your frontend's URL
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessStatus: 204, // No Content
  preflightContinue: true,
};

app.use(cors(corsOptions));
app.use(express.json());
//Database connection
connectDB();
//auto deletion
// setInterval(async () => {
//   try {
//     const currentDate = new Date();
//     const expiredImages = await Image.find({
//       expiryDate: { $lte: currentDate },
//     });

//     for (const image of expiredImages) {
//       await Image.findByIdAndDelete(image._id);
//     }

//     console.log("Expired images deleted successfully.");
//   } catch (error) {
//     console.error("Error deleting expired images:", error);
//   }
// }, 24 * 60 * 60 * 1000);

//routes
app.use("/api/v1/files/", fileRoutes);
app.use("/api/v1/auth/", authRoutes);
app.use("/", getFile);
let server = app.listen(process.env.PORT || 8080, () => {
  console.log("Server is runnng at port", process.env.PORT);
});
module.exports = server;
