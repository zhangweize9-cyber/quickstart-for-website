//
// `terminal-search.ts`
//
// Documention:
// - @xterm/xterm: https://github.com/xtermjs/xterm.js/blob/master/typings/xterm.d.ts
//                 https://xtermjs.org/docs/
//                 https://xtermjs.org/docs/guides/encoding/#output (term.onData)
// - @xterm/addon-fit: https://github.com/xtermjs/xterm.js/blob/master/addons/addon-fit/typings/addon-fit.d.ts
//                     https://xtermjs.org/docs/guides/using-addons/#usage-example (term.loadAddon)
//
// Illustrate:
// Search for files in the terminal to provide basic busybox command support,
// based on the xterm framework,
// busybox support based on the just-bash framework.
//
// Functions:
// - termWindowsMountTohtml: Mount the terminal window to the `index.html` file.
// - printPrompt: Print the command prompt in the terminal.
// - termInputOnEnter: After pressing Enter in the terminal, the output is displayed,
//                     and the input is passed to `just-bash` for execution.
// - termInputOnBackspace: Delete the character in the terminal when the Backspace key is pressed.
//

import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { WebLinksAddon } from "@xterm/addon-web-links";
import "@xterm/xterm/css/xterm.css";

/**
 * @file Virtual Busybox instruction set
 * @see {
 *   @link https://busybox.net/
 *   @link https://github.com/vercel-labs/just-bash/blob/main/packages/just-bash/README.md#supported-commands
 * } for further information.
 */
import { handleCommand } from "./utils/handle-cmd.ts";

let inputBuffer = "";
const topLine = "\r\n";

const term = new Terminal({
  cursorBlink: true,
  theme: {
    background: "#1e1e1e",
    foreground: "#ffffff",
  },
});

function termWindowsMountTohtml(term: Terminal) {
  /**
   * @summary Xterm plugins
   * @see {
   *   @link https://github.com/xtermjs/xterm.js#addons
   * }
   * @class FitAddon
   * @class WebLinksAddon
   */
  const fitAddon = new FitAddon();
  const weblinks = new WebLinksAddon();
  term.loadAddon(fitAddon);
  term.loadAddon(weblinks);

  /**
   * @summary Attach the welcome message to the terminal,
   *          and display the terminal window and input prompt.
   */
  const template = document.getElementById("greetings") as HTMLTemplateElement;
  const greetingsText = template.content.textContent;
  const termInput = document.getElementById("terminal");
  if (termInput) {
    term.open(termInput);
  }
  fitAddon.fit();

  /**
   * @summary Listen for window resize events and dynamically
   *          calculate the terminal window's width and height.
   */
  window.addEventListener("resize", () => {
    fitAddon.fit();
  });
  term.write(greetingsText?.replace(/\r?\n/g, "\r\n"));
}

function printPrompt() {
  term.write("\r\n$ ");
}

termWindowsMountTohtml(term);
printPrompt();

async function termInputOnEnter(term: Terminal) {
  term.write("\r\n");
  if (inputBuffer.trim().length > 0) {
    /**
     * @summary Return the execution output and remove newline characters.
     * @example
     * term.write('You entered: ' + inputBuffer + '\r\n');
     */
    term.write("You entered: " + inputBuffer + topLine);
    await handleCommand(inputBuffer, term);
  }
  inputBuffer = "";
  printPrompt();
}

function termInputOnBackspace(term: Terminal) {
  /**
   * @summary When a user makes a mistake while entering a string,
   *          pressing the Backspace key deletes the character.
   */
  if (inputBuffer.length > 0) {
    inputBuffer = inputBuffer.slice(0, -1);
    term.write("\b \b");
  }
}

term.onData(async function (e) {
  switch (e) {
    case "\r":
      await termInputOnEnter(term);
      break;
    case "\u007F":
      termInputOnBackspace(term);
      break;
    case "\x03":
      term.write("^C\r\n");
      inputBuffer = "";
      printPrompt();
      break;
    default:
      if (e >= " " || e === "\t") {
        inputBuffer += e;
        term.write(e);
      }
      break;
  }
});

// WIP: ctrl-c key event hook
// term.onKey(({ domEvent }) => {
//   if (domEvent.ctrlKey && domEvent.key === 'c') {
//     domEvent.preventDefault();
//     term.write('^C\r\n')
//   }
// })
//
// term.open(document.getElementById('terminal'));
// term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')
