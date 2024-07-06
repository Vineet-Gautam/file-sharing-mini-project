import React from "react";
import Upload from "./components/Upload";
import CodeInput from "./components/CodeInput";
import HowItWorks from "./components/HowItWorks";
export default function App() {
  return (
    <div className="bg-green-500">
    <HowItWorks />
      <div className="bg-red-500 max-w-xl m-auto mt-10 p-5">
      <Upload />
      <CodeInput />
      </div>
    </div>
  );
}
