import { Terminal } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';
import { handleCommand } from './utils/handle-cmd.js';

const term = new Terminal({
  cursorBlink: true,
  rows: 20,
  cols: 80
});
var inputBuffer = '';

term.open(document.getElementById('terminal'));
term.write(document.getElementById('greetings'));

function printPrompt() {
  term.write('\r\n$ ');
}

printPrompt();

term.onData(async function(e) {
    switch (e) {
        case '\r':
            term.write('\r\n');
            if (inputBuffer.trim().length > 0) {
              term.write('You entered: ' + inputBuffer + '\r\n');
              await handleCommand(inputBuffer, term);
            }
            inputBuffer = '';
            printPrompt();
            break;
        case '\u007F':
            if (inputBuffer.length > 0) {
                inputBuffer = inputBuffer.slice(0, -1);
                term.write('\b \b');
            }
            break;
      case '\x03':
        term.write("^C\r\n");
        inputBuffer = '';
        printPrompt();
        break;
        default:
            if (e >= ' ' || e === '\t') {
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
