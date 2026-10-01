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

import { Bash, defineCommand } from "just-bash";

import { virtualFS } from "./vir-filesystem.ts";

class DefineCommandOutput {
  public termIO = {
    stdout: "[info]",
    stderr: "",
    exitCode: 0,
  };

  public handleHello(args: string[]) {
    return {
      stdout: this.termIO.stdout + "hello" + " " + args,
      stderr: this.termIO.stderr,
      exitCode: this.termIO.exitCode,
    };
  }

  public getCmd() {
    return [defineCommand("hello", async (args) => this.handleHello(args))];
  }
}

const dfo = new DefineCommandOutput();
export async function handleCommand(cmdline: string, term: any) {
  const bash = new Bash({
    customCommands: dfo.getCmd(),
    // files: {
    //   "1.txt": "This is 1.txt.",
    //   "2.txt": "This is 2.txt.",
    //   "3.txt": "This is 3.txt.",
    // },
    files: virtualFS,
  });
  if (!cmdline.trim()) return;
  const response = await bash.exec(cmdline);
  if (response.stdout) {
    term.write(response.stdout.replace(/\r?\n/g, "\r\n"));
  }
  if (response.stderr) {
    term.write(response.stderr.replace(/\r?\n/g, "\r\n"));
  }
}
