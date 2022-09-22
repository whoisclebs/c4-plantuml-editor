import React, { useEffect, useState } from "react";
import CodeEditorWindow from "./CodeEditorWindow";
import { classnames } from "../utils/general";
import plantumlEncoder from 'plantuml-encoder';

import { defineTheme } from "../lib/defineTheme";
import useKeyPress from "../hooks/useKeyPress";
import Footer from "./Footer";

const c4Default = 
`
Person(1, "Label", "Optional Description")
Container(2, "Label", "Technology", "Optional Description")
System(3, "Label", "Optional Description")

Rel(1, 2, "Label", "Optional Technology")
`;

const Landing = () => {
  const [url, setUrl] = useState(null);
  const [code, setCode] = useState(c4Default);
  const [processing, setProcessing] = useState(null);
  const [theme, setTheme] = useState("cobalt");

  const enterPress = useKeyPress("Enter");
  const ctrlPress = useKeyPress("Control");


  useEffect(() => {
    if (enterPress && ctrlPress) {
      console.log("enterPress", enterPress);
      console.log("ctrlPress", ctrlPress);
      handleCompile();
    }
  }, [ctrlPress, enterPress]);
  const onChange = (action, data) => {
    switch (action) {
      case "code": {
        setCode(data);
        break;
      }
      default: {
        console.warn("case not handled!", action, data);
      }
    }
  };
  const handleCompile = () => {
    setProcessing(true);
    const code_with_mask = `
    @startuml C4_Elements
    !include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml
    ${code}
    @enduml`
    console.log("code_with_mask", code_with_mask);
    const encoded = plantumlEncoder.encode(code_with_mask);
    const url = `http://www.plantuml.com/plantuml/svg/${encoded}`;
    console.log("url", url);
    setUrl(url);
    setProcessing(false);
  };


  useEffect(() => {
    defineTheme("oceanic-next").then((_) =>
      setTheme({ value: "oceanic-next", label: "Oceanic Next" })
    );
  }, []);

  return (
    <>
      <div className="h-4 w-full bg-gradient-to-r from-purple-800 via-purple-500 to-purple-200"></div>
      <div className="flex flex-row space-x-4 items-start px-4 py-4">
        <div className="flex flex-col w-full h-full justify-start items-end">
          <CodeEditorWindow
            code={code}
            onChange={onChange}
            theme={theme.value}
          />
        </div>

        <div className="right-container flex flex-shrink-0 w-[50%] flex-col">
          <div className="flex flex-col items-end">
            <button
              onClick={handleCompile}
              disabled={!code}
              className={classnames(
                "mt-4 border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0",
                !code ? "opacity-50" : ""
              )}
            >
              {processing ? "Processing..." : "Compile and Execute"}
            </button>
          </div>
          { url ?  <img src={url} width="720" alt="teste"/>:<></>}
        </div>
      </div>
      <Footer />
    </>
  );
};
export default Landing;
