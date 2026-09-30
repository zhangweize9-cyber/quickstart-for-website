//
// `handle-cmd.ts`
//
// Documention:
// - just-bash: https://github.com/vercel-labs/just-bash/blob/main/packages/just-bash/README.md#supported-commands
//              https://www.npmjs.com/package/just-bash
//
// Illustrate:
// Support for virtual BusyBox commands,
// such as `cat`, `ls`, and `cd`, including some custom commands.
//
// Functions:
// - handleCommand: When a user enters a command in the terminal,
//                  the input is passed to the `Bash` process;
//                  the output is then retrieved via `response.stdout`,
//                  with extra newline characters removed to prevent formatting issues.
//

import { Bash } from "just-bash";

export async function handleCommand(cmdline: string, term: any) {
  const bash = new Bash({});
  if (!cmdline.trim()) return;
  const response = await bash.exec(cmdline);
  if (response.stdout) {
    term.write(response.stdout.replace(/\r?\n/g, "\r\n"));
  }
  if (response.stderr) {
    term.write(response.stderr.replace(/\r?\n/g, "\r\n"));
  }
}
