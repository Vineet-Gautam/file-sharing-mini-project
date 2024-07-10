import multer from "multer";
import path from "path";

// Multer configuration for disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    
    cb(null, file.originalname); // File naming scheme
  },
});

const upload = multer({ storage: storage });

export default upload;

