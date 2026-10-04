import "@xterm/xterm/css/xterm.css";
import { initTerminalSearch, termWindowsMountTohtml } from "@/utils/terminal";
import React from "react";

const cssFiles = ["/style/terminal-mobile.css", "/style/terminal-desktop.css"];

function loadCssByInsides(allFiles: string[], indicesToLoad: number[]) {
  indicesToLoad.forEach((index) => {
    const files = allFiles[index];
    if (files) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = files;
      document.head.append(link);
    }
  });
}

export const TerminalPage: React.FC = () => {
  const isMobile =
    typeof globalThis.window !== "undefined" && globalThis.innerWidth <= 768;
  if (isMobile) {
    loadCssByInsides(cssFiles, [0]);
  } else {
    loadCssByInsides(cssFiles, [1]);
  }

  const { containerRef } = termWindowsMountTohtml();
  initTerminalSearch();

  return (
    <>
      <div id="greetings" style={{ display: "none" }}>
        Hello World! https://github.com/zhangweize9-cyber
      </div>
      <div>
        <div ref={containerRef}></div>
      </div>
    </>
  );
};

export default TerminalPage;
