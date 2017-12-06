import AbstractCommand from "piper-process/abstract-command";

export default function createCommandClass(commandFunction, args) {
  class Command extends AbstractCommand {
    async start(runtime) {
      const { stdin, stdout, stderr } = this;
      const exitCode = await commandFunction({
        args,
        stdin,
        stdout,
        stderr,
        runtime
      });
      this.emit("exit", exitCode);
      return exitCode;
    }
  }
  return new Command();
}
