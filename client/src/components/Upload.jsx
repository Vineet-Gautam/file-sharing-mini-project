import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

export default function Upload() {
  const [files, setFiles] = useState([]);

  const { getRootProps, getInputProps } = useDropzone({
    multiple: true, // Enable multiple file selection
    onDrop: (acceptedFiles) => {
      setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    },
  });

  const removeFile = (fileName) => {
    setFiles(files.filter((file) => file.name !== fileName));
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
            className="bg-white p-2 my-2 border border-gray-300 rounded shadow-sm flex justify-between items-center"
          >
            {file.name}
            <button
              onClick={() => removeFile(file.name)}
              className="ml-4 text-red-600 font-bold"
            >
              &times;
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
