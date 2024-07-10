import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    fileUrl: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
    },
    code: {
      type: Number,
      required: true,
    },

  },
  {
    timestamps: true,
  }
);

const File = mongoose.model("File", fileSchema);

export default File;

// export default mongoose.model('User', userSchema); also fine
