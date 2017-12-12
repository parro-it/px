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

    const executingAsync = [];
    for (const cmd of this.node.commands.slice(0, -1)) {
      pipe(cmd);
      const result = cmd.process.start(runtimeEnv);
      if (cmd.async) {
        executingAsync.push(result);
      } else {
        await result;
      }
    }

    const lastCmd = this.node.commands[this.node.commands.length - 1];
    pipe(lastCmd);
    const exitCode = lastCmd.process.start(runtimeEnv);

    const results = await Promise.all([exitCode].concat(executingAsync));

    this.emit("exit", 0);
    debug("done script");
    return results[0];
  }
}

export function Script(node) {
  node.process = new ScriptCommand(node);
  return node;
}
