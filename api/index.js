import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import upload from "./multer.js";
import cloudinary from "./cloudinary.js";
import path from "path";
dotenv.config();
const app = express();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log("Failed to connect", err);
  });


app.use(express.json());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

app.get("/api", (req, res) => {
  console.log("Made it into GET");
  res.json({
    message: "This is GET",
  });
});

app.post("/api", upload.single("file"), async (req, res) => {
  try {
    console.log("Received file:", req.file); // Log the received file object
    // console.log("Received body:", req.body); // Log the entire body to check other fields

    const file = req.file;

    if (!file || file.size === 0) {
      return res.status(400).json({ message: "Empty file" });
    }

    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: "raw",
      folder: "uploads",
      public_id: file.originalname, // Use original file name as public_id
    });

    // Respond with the Cloudinary result
    console.log(result);
    res.status(200).json({ message: "File uploaded successfully", data: result });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).send("Error uploading file");
  }
});
