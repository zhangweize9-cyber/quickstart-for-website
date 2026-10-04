import { useEffect } from "react";

export default function TerminalPage() {
  useEffect(() => {
    const isMobile = window.innerWidth <= 768,
     link = document.createElement("link");
    link.rel = "stylesheet";
    link.id = "dynamic-layout-style";
    link.href = isMobile
      ? "/style/terminal-mobile.css"
      : "/style/terminal-desktop.css";

    const oldLink = document.querySelector("#dynamic-layout-style");
    if (oldLink) {oldLink.remove();}
    document.head.append(link);

    import("@/terminal-search").then((m) => {
      m.initTerminalSearch();
    });

    return () => {
      link.remove();
    };
  }, []);

  return (
    <>
      <div id="greetings" style={{ display: "none" }}>
        Hello World! https://github.com/zhangweize9-cyber
      </div>
      <div className="terminal-wrapper">
        <div id="terminal"></div>
      </div>
    </>
  );
}
