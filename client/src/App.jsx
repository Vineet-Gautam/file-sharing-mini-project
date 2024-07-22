import { useState } from "react";
import Upload from "./components/Upload";
import CodeInput from "./components/CodeInput";
export default function App() {
  const [message, setMessage] = useState("");

  

  

  return (
    <div className="">
      <div className="max-w-xl m-auto mt-10 p-5">
        <Upload />
        <CodeInput />
      </div>
    </div>
  );
}
