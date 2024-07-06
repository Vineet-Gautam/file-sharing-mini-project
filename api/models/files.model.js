import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    fileUrls: {
      type: [String],
      required: true,
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
