import test from "ava";
import execa from "execa";

test("run a command", async t => {
  const proc = await execa("node", [
    `${__dirname}/../src/cli.js`,
    "-c",
    `find ${__dirname}`
  ]);
  t.is(
    proc.stdout,
    "/home/parro-it/repos/px/test\n/home/parro-it/repos/px/test/test-cli.js\n/home/parro-it/repos/px/test/test-runtime.js"
  );
});
