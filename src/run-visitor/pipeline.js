import AbstractCommand from "piper-process/abstract-command";
import _debug from "debug";

const debug = _debug("px");

class PipelineCommand extends AbstractCommand {
  constructor(node) {
    super("");
    this.node = node;
  }

  async start(runtimeEnv) {
    debug("start pipeline");
    this.node.commands.reduce((prev, curr) => {
      return prev.process.pipeToCommand(curr.process);
    });

    const last = this.node.commands[this.node.commands.length - 1];
    const first = this.node.commands[0];
    last.process.stdout.pipe(this.stdout);
    last.process.stderr.pipe(this.stderr);
    this.stdin.pipe(first.process.stdin);

    const allProcessesRunning = Promise.all(
      this.node.commands.map(cmd => {
        return cmd.process.exitCode;
      })
    );

    last.process.start(runtimeEnv);
    await allProcessesRunning;
    const res = await last.process.exitCode;
    debug("done pipeline");
    return res;
  }
}

export const Pipeline = node => {
  node.process = new PipelineCommand(node);
  return node;
};
