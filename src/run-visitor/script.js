import AbstractCommand from "piper-process/abstract-command";
import _debug from "debug";

const debug = _debug("px");

class ScriptCommand extends AbstractCommand {
  constructor(node) {
    super("");
    this.node = node;
  }
  async start(runtimeEnv) {
    debug("start script");
    const pipe = cmd => {
      cmd.process.stdout.pipe(this.stdout, { end: false });
      cmd.process.stderr.pipe(this.stderr, { end: false });
      this.stdin.pipe(cmd.process.stdin, { end: false });
    };

    for (const cmd of this.node.commands.slice(0, -1)) {
      pipe(cmd);
      await cmd.process.start(runtimeEnv);
    }

    const lastCmd = this.node.commands[this.node.commands.length - 1];
    pipe(lastCmd);
    const exitCode = await lastCmd.process.start(runtimeEnv);

    this.emit("exit", 0);
    debug("done script");
    return exitCode;
  }
}

export function Script(node) {
  node.process = new ScriptCommand(node);
  return node;
}
