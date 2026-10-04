//
// `handle-cmd.ts`
//
// Documention:
// - just-bash: https://github.com/vercel-labs/just-bash/blob/main/packages/just-bash/README.md#supported-commands
//              https://www.npmjs.com/package/just-bash
//
// Illustrate:
// Support for virtual BusyBox commands,
// Such as `cat`, `ls`, and `cd`, including some custom commands.
//
// Class:
// - DefineCommandOutput: Define terminal commands. {
//   TermIO: Includes standard output, error messages,
//           And the command execution return value.
//           { stdout, stderr, exitCode }
//   GetCmd: Hand the command over to the just-bash module for processing.
//   HandleHello: Display "hello" in the terminal when the user says hello.
// }
//
// Functions:
// - handleCommand: When a user enters a command in the terminal,
//                  The input is passed to the `Bash` process;
//                  The output is then retrieved via `response.stdout`,
//                  With extra newline characters removed to prevent formatting issues.
//

import { Bash, defineCommand } from "just-bash";
import type { Terminal } from "@xterm/xterm";

/**
 * @file Frontend virtual file system
 * @see {
 *   @link https://docs.kernel.org/filesystems/index.html
 * }
 */
import { virtualFS } from "./vir-filesystem";

class DefineCommandOutput {
  /**
   * Standard input, output and return values.
   * `this.termIO.ansi` adds support for terminal color layout.
   *
   * @example
   * this.termIO.stdout = "This is output message."
   * this.termIO.stderr = "This is error message."
   * this.termIO.exitCode = "0" - success
   *
   * const colors = this.termIO.ansi
   * term.write(`${colors.cyan}USAGE:${colors.reset}\n`);
   */
  public termIO = {
    ansi: {
      bold: "\u001B[1m",
      cyan: "\u001B[36m",
      green: "\u001B[32m",
      red: "\u001B[31m",
      reset: "\u001B[0m",
      yellow: "\u001B[33m",
    },
    exitCode: 0,
    stderr: "",
    stdout: "[info]",
  };

  /**
   * Local large model switch (if enabled by default, it will consume
   * storage space and slow down the terminal response speed).
   *
   * @default disabled
   * @example `natural-lang --open` (bash terminal)
   */
  private enabledNaturalLanguageModule() {
    localStorage.setItem("enabled_local_natural_language_search", "enabled");
  }

  public handleHello(args: string[]) {
    /**
     * @deprecated
     * NOTE: This is test command, will be removed in the future.
     */
    return {
      exitCode: this.termIO.exitCode,
      stderr: this.termIO.stderr,
      stdout: `${this.termIO.stdout}hello ${args.join(" ")}`,
    };
  }

  public async handleNaturalSearch(args: string[]) {
    if (args[0] === "--open") {
      this.enabledNaturalLanguageModule();
      return {
        stdout: "Enabled natural search summary on terminal.",
        stderr: "",
        exitCode: 0,
      };
    } else if (args[0] === "--generate") {
      const { getNaturalOutput } = await import("./natural-search");
      const outputStr = await getNaturalOutput();
      return { stdout: outputStr, stderr: "", exitCode: 0 };
    }
    return { stdout: "What happened?", stderr: "", exitCode: 0 };
  }

  public getCmd() {
    /**
     * Instantiate a written function.
     * Use the `dfo.getCmd()` function to delegate execution to just-bash.
     *
     * @see {
     *   @link https://github.com/vercel-labs/just-bash/blob/main/packages/just-bash/README.md#custom-commands
     *   @example
     *   ```typescript
     *   const hello = defineCommand("hello", async (args, ctx) => {
     *    const name = args[0] || "world";
     *    return { stdout: `Hello, ${name}!\n`, stderr: "", exitCode: 0 };
     *   });
     *   await bash.exec("hello Alice"); // "Hello, Alice!\n"
     *   ```
     * }
     */
    return [
      defineCommand("hello", (args) => Promise.resolve(this.handleHello(args))),
      defineCommand("natural-lang", (args) =>
        Promise.resolve(this.handleNaturalSearch(args)),
      ),
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
  if (!cmdline.trim()) {
    return;
  }
  const response = await bash.exec(cmdline);
  if (response.stdout) {
    term.write(response.stdout.replaceAll(/\r?\n/g, "\r\n"));
  }
  if (response.stderr) {
    term.write(response.stderr.replaceAll(/\r?\n/g, "\r\n"));
  }
}
