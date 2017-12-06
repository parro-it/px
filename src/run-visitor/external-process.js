import { cmd } from "piper-process";

const setupRedirectionForProcess = proc => node => {
  if (node.type === "Redirect") {
    if (node.op.text === "<") {
      proc.inputFrom(node.file.text);
    }
    if (node.op.text === ">") {
      if (node.numberIo === 2) {
        proc.errorTo(node.file.text);
      }
      proc.outputTo(node.file.text);
    }
  }
};

export const externalProcess = command => {
  const commandId = command.name.text;
  const args = command.suffix
    .concat(command.prefix)
    .filter(node => node.type === "Word")
    .map(word => word.text);

  const proc = cmd(commandId, ...args);
  const setupRedirection = setupRedirectionForProcess(proc);
  if (command.suffix) {
    command.suffix.forEach(setupRedirection);
  }

  if (command.prefix) {
    command.prefix.forEach(setupRedirection);
  }

  proc.on("error", err => {
    proc.stderr.write(`${err.message}\n`);
  });

  const originalStart = proc.start;
  proc.start = runtime => {
    const result = originalStart.call(proc);
    runtime.children.add(proc.pid);
    proc.on("exit", () => {
      runtime.children.delete(proc.pid);
    });

    return result;
  };

  return proc;
};
