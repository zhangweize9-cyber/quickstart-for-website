import { Bash } from 'just-bash';

export async function handleCommand(cmdline, term) {
  const bash = new Bash({});
  if (!cmdline.trim()) return;
  const response = await bash.exec(cmdline);
  if (response.stdout) {
    term.write(response.stdout.replace(/\r?\n/g + '\r\n'));
  }
  if (response.stderr) {
    term.write(response.stderr.replace(/\r?\n/g + '\r\n'));
  }
}
