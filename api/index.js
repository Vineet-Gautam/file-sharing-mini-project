// import express from "express";
// import dotenv from "dotenv";
// import mongoose from "mongoose";
// import upload from "./multer.js";
// import cloudinary from "./cloudinary.js";
// import fs from "fs";
// dotenv.config();
// const app = express();

// mongoose
//   .connect(process.env.MONGO)
//   .then(() => {
//     console.log("Connected to database");
//   })
//   .catch((err) => {
//     console.log("Failed to connect", err);
//   });


// app.use(express.json());

// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//   console.log(`Listening on port ${PORT}`);
// });

// app.get("/api", (req, res) => {
//   console.log("Made it into GET");
//   res.json({
//     message: "This is GET",
//   });
// });

// app.post("/api", upload.single("file"), async (req, res) => {
//   try {
//     console.log("Received file:", req.file); 

//     const file = req.file;

//     if (!file || file.size === 0) {
//       return res.status(400).json({ message: "Empty file" });
//     }
//     const fileName = file.originalname;

    
//     const result = await cloudinary.uploader.upload(file.path, {
//       resource_type: "raw",
//       folder: "uploads",
//       public_id: file.originalname,
//     });

    
//     fs.unlink(file.path, (err) => {
//       if (err) {
//         console.error("Error deleting local file:", err);
//       } else {
//         console.log("Deleted local file:", file.path);
//       }
//     });

//     const fileUrl = result.secure_url;
//     console.log(fileUrl, fileName);
//     res.status(200).json({ message: "File uploaded successfully"});
//   } catch (error) {
//     console.error("Error uploading file:", error);
//     res.status(500).send("Error uploading file");
//   }
// });

import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import upload from "./multer.js";
import cloudinary from "./cloudinary.js";
import fs from "fs";
import File from "./models/files.model.js";

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

app.post("/api", upload.single("file"), async (req, res) => {
  try {
    console.log("Received file:", req.file); 

    const file = req.file;

    if (!file || file.size === 0) {
      return res.status(400).json({ message: "Empty file" });
    }
    const fileName = file.originalname;

    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: "raw",
      folder: "uploads",
      public_id: file.originalname,
    });

    // Delete the file from local storage
    fs.unlink(file.path, (err) => {
      if (err) {
        console.error("Error deleting local file:", err);
      } else {
        console.log("Deleted local file:", file.path);
      }
    });

    const fileUrl = result.secure_url;

    // Generate unique 4-digit code
    const code = await generateUniqueCode();

    // Save file information to MongoDB
    const newFile = new File({
      fileUrl,
      fileName,
      code,
    });

    await newFile.save();

    res.status(200).json({ message: "File uploaded successfully", data: newFile });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).send("Error uploading file");
  }
});

// Function to generate a unique 4-digit code
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
    // Find one file whose `code` matches the query parameter `code`
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