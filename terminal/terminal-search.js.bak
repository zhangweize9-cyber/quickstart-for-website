import { Terminal } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';

const term = new Terminal({
  cursorBlink: true,
  rows: 20,
  cols: 80
});
var inputBuffer = '';

term.open(document.getElementById('terminal'));
term.write(document.getElementById('greetings'));

function handleCommand(cmd) {
  if (!cmd) return;
  const [actions, ...args] = cmd.split(' ');

  switch (actions) {
    case 'help':
      term.write("Command: help, clear, echo, cat\r\n");
      break;
    case 'echo':
      term.write(args.join(' \r\n'));
      break;
    case 'clear':
      term.clear();
      break;
    default:
      term.write('command not found\r\n');
  }
}

term.onData(function(e) {
    switch (e) {
        case '\r':
            term.write('\r\n');
            if (inputBuffer.trim().length > 0) {
                term.write('You entered: ' + inputBuffer + '\r\n');
            }
            handleCommand(inputBuffer);
            inputBuffer = '';
            term.write('$ ');
            break;
        case '\u007F':
            if (inputBuffer.length > 0) {
                inputBuffer = inputBuffer.slice(0, -1);
                term.write('\b \b');
            }
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
// term.onKey(({ key, domEvent }) => {
//   if (domEvent.ctrlKey && domEvent.key === 'c') {
//     domEvent.preventDefault();
//     term.write('^C\r\n')
//   }
// })
//
// term.open(document.getElementById('terminal'));
// term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')
