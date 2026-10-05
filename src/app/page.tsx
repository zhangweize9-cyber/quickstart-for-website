"use client";

import "@xterm/xterm/css/xterm.css";
import {
  initTerminalSearch,
  useTermWindowsMountTohtml,
} from "@/utils/terminal";
import React from "react";
import { useLayoutEffect } from "react";

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

/**
 * FIXME: Known issue: After migrating from native TypeScript to React for
 * mobile devices, the text columns in xterm.js automatically shrink
 * to 2 characters wide when dragging the window. Neither `useEffect`
 * nor `useLayoutEffect` can solve this problem. Because I've invested
 * too much time in this module, I'll temporarily abandon it and fix it
 * later when I have more time.
 * My focus for now is on the article display interface.
 */
export const TerminalPage: React.FC = () => {
  const { containerRef } = useTermWindowsMountTohtml();

  useLayoutEffect(() => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      loadCssByInsides(cssFiles, [0]);
    } else {
      loadCssByInsides(cssFiles, [1]);
    }

    initTerminalSearch();
  });

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
