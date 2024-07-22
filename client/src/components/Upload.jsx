import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

const Upload = () => {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [code, setCode] = useState(null);

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    maxSize: 2 * 1024 * 1024, // 2 MB in bytes
    onDrop: (acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        const rejectedFile = rejectedFiles[0];
        setError(`File ${rejectedFile.name} is too large. Max size is 2 MB.`);
      } else {
        setFiles(acceptedFiles);
        setError(null); // Clear any previous errors
      }
    },
  });

  const handlePost = async () => {
    try {
      if (error) {
        throw new Error(error); // Throw error if file size exceeded
      }

      const formData = new FormData();
      formData.append("file", files[0]); // Assuming only one file is selected

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const data = await response.json();
      setMessage(data.message); // Display server response message
      setCode(data.code); // Set the generated code
    } catch (error) {
      console.error("Error:", error.message);
      setMessage("Error uploading file");
    }
  };

  return (
    <div className="p-4 flex flex-col align-center justify-center">
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-400 p-10 rounded cursor-pointer text-center"
      >
        <input {...getInputProps()} />
        <p className="text-gray-600">
          Drag 'n' drop some files here, or click to select files
        </p>
      </div>
      <ul className="mt-4">
        {files.map((file, index) => (
          <li
            key={index}
            className="p-2 my-2 border border-gray-300 rounded shadow-sm flex justify-between items-center"
          >
            {file.name}
          </li>
        ))}
      </ul>
      {error && <p className="text-red-600 mt-2">{error}</p>}
      <button
        onClick={handlePost}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
      >
        Upload File
      </button>
      {message && <p className="mt-2">{message}</p>}
      {code && <p className="mt-2">Your unique code: {code}</p>}
    </div>
  );
};

export default Upload;
