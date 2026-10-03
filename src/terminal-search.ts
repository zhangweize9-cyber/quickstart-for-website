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

/**
 * @see {
 *   @link https://en.wikipedia.org/wiki/ANSI_escape_code
 * }
 */
const escapeSeq = {
  ansi: {
    arrows: {
      up: "\x1b[A",
      down: "\x1b[B",
      left: "\x1b[C",
      right: "\x1b[D",
    },
  },
  ascii: {
    topLine: "\r\n",
    space: " ",
    backspace: "\u007f",
    sigint: "\x03",
    enter: "\r",
    deleteChar: "\b \b",
  },
};

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
  term.write(greetingsText?.replace(/\r?\n/g, escapeSeq.ascii.topLine));
}

function printPrompt() {
  term.write(escapeSeq.ascii.topLine + "$ ");
}

termWindowsMountTohtml(term);
printPrompt();
let inputBuffer = "";

async function termInputOnEnter(term: Terminal) {
  term.write(escapeSeq.ascii.topLine);
  try {
    if (inputBuffer.trim().length > 0) {
      /**
       * @summary Return the execution output and remove newline characters.
       * @example
       * term.write('You entered: ' + inputBuffer + '\r\n');
       */
      term.write("You entered: " + inputBuffer + escapeSeq.ascii.topLine);
      await handleCommand(inputBuffer, term);
    }
  } finally {
    inputBuffer = "";
    printPrompt();
  }
}

function termInputOnBackspace(term: Terminal) {
  /**
   * @summary When a user makes a mistake while entering a string,
   *          pressing the Backspace key deletes the character.
   */
  if (inputBuffer.length > 0) {
    inputBuffer = inputBuffer.slice(0, -1);
    term.write(escapeSeq.ascii.deleteChar);
  }
}

term.onData(async function (e) {
  switch (e) {
    case escapeSeq.ascii.enter:
      await termInputOnEnter(term);
      break;
    case escapeSeq.ascii.deleteChar:
      termInputOnBackspace(term);
      break;
    case escapeSeq.ascii.sigint:
      /**
       * FIXME: It's currently difficult to capture the Ctrl+C signal because the Windows shortcuts
       *        for copy and paste are Ctrl+C and Ctrl+V.
       *        It's hard to determine whether a user presses Ctrl+C to terminate a terminal task
       *        or to copy and paste content.
       *        TL;DR: There is a conflict with the Ctrl+C shortcut.
       */
      term.write("^C\r\n" + escapeSeq.ascii.sigint);
      inputBuffer = "";
      printPrompt();
      break;
    default:
      /**
       * It also enables echoing as you type in the terminal
       * (placing your input immediately after the prompt).
       * TODO: When the Tab key is pressed to trigger autocomplete,
       *       the completion options (WIP) pop up.
       */
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
