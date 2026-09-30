const virtualFS = {
  type: "dir",
  children: {
    "home": {
      type: "dir",
      children: {
        "workspace": {
          type: "dir",
          children: {
            "index.js": { type: "file", content: "console.log('Hello World!');" },
            "README.md": { type: "file", content: "# Main Project\nThis is a pure frontend terminal sandbox." }
          }
        },
        "todo.txt": { type: "file", content: "1. Learn Xterm.js\n2. Build a virtual FS." }
      }
    },
    "etc": {
      type: "dir",
      children: {
        "config.json": { type: "file", content: '{"env": "production"}' }
      }
    }
  }
};
