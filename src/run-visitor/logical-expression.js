import AbstractCommand from "piper-process/abstract-command";
import _debug from "debug";

const debug = _debug(`px`);

class LogicalExpressionCommand extends AbstractCommand {
  constructor(node) {
    super("");
    this.node = node;
  }
  async start(runtime) {
    debug("start LogicalExpression");
    const pipe = (cmd, end) => {
      cmd.process.stdout.pipe(this.stdout, { end });
      cmd.process.stderr.pipe(this.stderr, { end });
      this.stdin.pipe(cmd.process.stdin, { end });
    };

    const { left, right, op } = this.node;
    pipe(left, false);
    left.process.start(runtime);
    const leftExitCode = await left.process.exitCode;

    debug("done left, leftExitCode:" + leftExitCode);

    if (op === "and") {
      if (leftExitCode !== 0) {
        // Shortcircuit. right is not started
        return leftExitCode;
      }
    } else if (op === "or") {
      if (leftExitCode === 0) {
        // Shortcircuit. right is not started
        return leftExitCode;
      }
    } else {
      throw new Error(`Unknown opertor ${op}`);
    }

    pipe(right, true);
    right.process.start(runtime);
    const rightExitCode = await right.process.exitCode;
    debug("done right, rightExitCode:" + rightExitCode);
    this.emit("exit", rightExitCode);
    return rightExitCode;
  }
}

export function LogicalExpression(node) {
  node.process = new LogicalExpressionCommand(node);
  return node;
}
