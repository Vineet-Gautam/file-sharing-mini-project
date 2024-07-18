// import React, { useState } from "react";

// const CodeInput = ({ onAccept }) => {
//   const [code, setCode] = useState("");
//   const [fileInfo, setFileInfo] = useState(null);
//   const [error, setError] = useState(null);

//   const handleChange = (e) => {
//     const value = e.target.value;
//     // Ensure only 4-digit numbers are accepted
//     if (/^\d{0,4}$/.test(value)) {
//       setCode(value);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     fetch(`/api?code=${code}`)
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error("Code not found");
//         }
//         return response.json();
//       })
//       .then((data) => {
//         setFileInfo(data.file);
//         setError(null);
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//         setError("File not found for the entered code.");
//         setFileInfo(null);
//       });
//   };

//   return (
//     <div className="flex flex-col items-center">
//       <form onSubmit={handleSubmit} className="flex flex-col items-center">
//         <label htmlFor="codeInput" className="mt-4 mb-2 text-lg font-medium">
//           Enter 4-digit Code:
//         </label>
//         <input
//           id="codeInput"
//           type="text"
//           maxLength={4}
//           value={code}
//           onChange={handleChange}
//           className="border border-gray-300 rounded px-3 py-2 text-lg focus:outline-none focus:border-blue-500"
//         />
//         <button
//           type="submit"
//           className="mt-4 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none"
//         >
//           Get File
//         </button>
//       </form>

//       {error && <p className="text-red-500 mt-2">{error}</p>}

//       {fileInfo && (
//         <div className="mt-4">
//           <h2 className="text-lg font-medium">File Information:</h2>
//           <p>File Name: {fileInfo.fileName}</p>
//           <p>
//             File URL:{" "}
//             <a
//               href={fileInfo.fileUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               {fileInfo.fileUrl}
//             </a>
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CodeInput;
import React, { useState } from "react";

const CodeInput = () => {
  const [code, setCode] = useState("");
  const [fileInfo, setFileInfo] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { value } = e.target;
    // Ensure only 4-digit numbers are accepted
    if (/^\d{0,4}$/.test(value)) {
      setCode(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api?code=${code}`);
      if (!response.ok) {
        throw new Error("File not found for the entered code.");
      }
      const data = await response.json();
      setFileInfo(data.file);
      setError(null);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
      setFileInfo(null);
    }
  };

  const handleDownload = () => {
    if (fileInfo) {
      fetch(fileInfo.fileUrl)
        .then((response) => response.blob())
        .then((blob) => {
          const url = URL.createObjectURL(blob);

          const downloadLink = document.createElement("a");
          downloadLink.href = url;
          downloadLink.setAttribute("download", fileInfo.fileName);

          document.body.appendChild(downloadLink);
          downloadLink.click();

          document.body.removeChild(downloadLink);
          URL.revokeObjectURL(url);
        })
        .catch((error) => {
          console.error("Error downloading file:", error);
        });
    }
  };

  return (
    <div className="flex flex-col items-center">
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <label htmlFor="codeInput" className="mt-4 mb-2 text-lg font-medium">
          Enter 4-digit Code:
        </label>
        <input
          id="codeInput"
          type="text"
          maxLength={4}
          value={code}
          onChange={handleChange}
          className="border border-gray-300 rounded px-3 py-2 text-lg focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          className="mt-4 text-white px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 focus:outline-none"
        >
          Get File
        </button>
      </form>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {fileInfo && (
        <div className="mt-4">
          <h2 className="text-lg font-medium">File Information:</h2>
          <p>File Name: {fileInfo.fileName}</p>
          <button
            onClick={handleDownload}
            className="mt-2 text-white px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 focus:outline-none"
          >
            Download File
          </button>
        </div>
      )}
    </div>
  );
};

export default CodeInput;
