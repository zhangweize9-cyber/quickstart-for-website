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
// Class:
// - DefineCommandOutput: Define terminal commands. {
//   termIO: Includes standard output, error messages,
//           and the command execution return value.
//           { stdout, stderr, exitCode }
//   getCmd: Hand the command over to the just-bash module for processing.
//   handleHello: Display "hello" in the terminal when the user says hello.
// }
//
// Functions:
// - handleCommand: When a user enters a command in the terminal,
//                  the input is passed to the `Bash` process;
//                  the output is then retrieved via `response.stdout`,
//                  with extra newline characters removed to prevent formatting issues.
//

import type { Terminal } from "@xterm/xterm";
import { Bash, defineCommand } from "just-bash";

/**
 * @file Frontend virtual file system
 * @see {
 *   @link https://docs.kernel.org/filesystems/index.html
 * }
 */
import { virtualFS } from "./vir-filesystem.ts";

class DefineCommandOutput {
  public termIO = {
    stdout: "[info]",
    stderr: "",
    exitCode: 0,
  };

  public handleHello(args: string[]) {
    return {
      stdout: this.termIO.stdout + "hello" + " " + args.join(" "),
      stderr: this.termIO.stderr,
      exitCode: this.termIO.exitCode,
    };
  }

  public getCmd() {
    return [
      defineCommand("hello", (args) => Promise.resolve(this.handleHello(args))),
    ];
  }
}

const dfo = new DefineCommandOutput();
export async function handleCommand(cmdline: string, term: Terminal) {
  /**
   * @summary Initialize the executable command envirorment.
   * @param customCommands - Custom executable commands.
   * @param files - Virtual File System.
   */
  const bash = new Bash({
    customCommands: dfo.getCmd(),
    /**
     * @example
     * files: {
     *   "1.txt": "This is 1.txt.",
     *   "2.txt": "This is 2.txt.",
     *   "3.txt": "This is 3.txt.",
     * },
     */
    files: virtualFS,
  });

  /**
   * @summary Remove extra spaces and line breaks.
   */
  if (!cmdline.trim()) return;
  const response = await bash.exec(cmdline);
  if (response.stdout) {
    term.write(response.stdout.replace(/\r?\n/g, "\r\n"));
  }
  if (response.stderr) {
    term.write(response.stderr.replace(/\r?\n/g, "\r\n"));
  }
}
