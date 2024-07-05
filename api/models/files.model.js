import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    fileUrl: {
        type: String,
        required: true,
    }, 
    code: {
        type: Number,
        required: true,
    }
}, {
    timestamps: true,
})

const File = mongoose.model('File', fileSchema);

export default User;

// export default mongoose.model('User', userSchema); also fine