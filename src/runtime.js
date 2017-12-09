import traverse from "bash-ast-traverser";
import runVisitor from "./run-visitor/index";
import bashParser from "bash-parser";

export default () => ({
  children: new Set(),
  killForeground() {
    for (const proc of this.children) {
      if (typeof proc !== "number") {
        console.error(`Detected invalid pid for children process: <${proc}>`);
        return;
      }
      process.kill(proc, "SIGTERM");
    }
  },

  runAst(ast, stdio = true) {
    if (ast) {
      const enhancedAst = traverse(ast, runVisitor(this));
      const script = enhancedAst.process;
      process.stdin.pipe(script.stdin, { end: false });
      if (stdio) {
        script.stdout.pipe(process.stdout);
        script.stderr.pipe(process.stderr);
      }

      script.start(this).then(() => {
        process.stdin.unpipe(script.stdin);

        setTimeout(() => {
          script.stdout.end();
          script.stderr.end();
          script.stdin.end();
        }, 10);
      });

      return script;
    }
  },

  run(cmd, stdio = true) {
    let ast;
    try {
      ast = bashParser(cmd);
    } catch (err) {
      process.stderr.write(`${err.message}\n`);
      return Promise.resolve(2);
    }
    if (ast) {
      return this.runAst(ast, stdio);
    }
  }
});
