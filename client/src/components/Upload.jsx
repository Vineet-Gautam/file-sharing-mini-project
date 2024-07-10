import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

export default function Upload() {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false, // Only accept one file
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles); // Only keep the last accepted file
    },
  });

  const handlePost = async () => {
    try {
      const formData = new FormData();
      formData.append('file', files[0]); // Assuming only one file is selected
      // console.log([...formData]); // Check FormData contents
      console.log("Selected file:", files[0]); // Check if files[0] is correctly populated

      const response = await fetch("/api", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const data = await response.json();
      setMessage(data.message); // Display server response message
    } catch (error) {
      console.error("Error:", error);
      setMessage('Error uploading file');
    }
  };

  return (
    <div className="p-4">
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
            className=" p-2 my-2 border border-gray-300 rounded shadow-sm flex justify-between items-center"
          >
            {file.name}
            {/* Uncomment if you implement removeFile function
            <button
              onClick={() => removeFile(file.name)}
              className="ml-4 text-red-600 font-bold"
            >
              &times;
            </button>
            */}
          </li>
        ))}
      </ul>
      <button onClick={handlePost} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
        Upload File
      </button>
      {message && <p className="mt-2">{message}</p>}
    </div>
  );
}
