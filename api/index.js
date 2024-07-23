import tmp from 'tmp';
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import upload from "./multer.js";
import cloudinary from "./cloudinary.js";
import fs from "fs";
import File from "./models/files.model.js";
import cron from "node-cron";
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

const __dirname = path.resolve();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    console.log("Received file:", req.file);

    const file = req.file;

    if (!file || file.size === 0) {
      return res.status(400).json({ message: "Empty file" });
    }

    const tmpFilePath = tmp.tmpNameSync();
    fs.copyFileSync(file.path, tmpFilePath);

    const result = await cloudinary.uploader.upload(tmpFilePath, {
      resource_type: "raw",
      folder: "uploads",
      public_id: file.originalname,
    });

    fs.unlinkSync(tmpFilePath);

    const fileUrl = result.secure_url;

    const code = await generateUniqueCode();

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const newFile = new File({
      fileUrl,
      fileName: file.originalname,
      code,
      expiresAt,
    });

    await newFile.save();

    res.status(200).json({ message: "File uploaded successfully", data: newFile, code });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).send("Error uploading file");
  }
});

const generateUniqueCode = async () => {
  const min = 1000;
  const max = 9999;
  let code;
  let existingFile;

  do {
    code = Math.floor(Math.random() * (max - min + 1)) + min;
    existingFile = await File.findOne({ code });
  } while (existingFile);

  return code;
};

app.get("/api", async (req, res) => {
  try {
    const code = req.query.code;
    const file = await File.findOne({ code: Number(code) }).exec();

    if (!file) {
      return res.status(404).json({ message: "File not found for the entered code" });
    }

    res.status(200).json({ message: "File found", file });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Server error");
  }
});

cron.schedule("0 * * * *", async () => {
  try {
    const now = new Date();
    const expiredFiles = await File.find({ expiresAt: { $lt: now } });

    for (const file of expiredFiles) {
      await cloudinary.uploader.destroy(file.fileName, { resource_type: "raw" });

      await File.deleteOne({ _id: file._id });
    }

    console.log(`Deleted ${expiredFiles.length} expired files.`);
  } catch (error) {
    console.error("Error deleting expired files:", error);
  }
});

app.use(express.static(path.join(__dirname, "/client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});
