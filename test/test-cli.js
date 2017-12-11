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
    `${__dirname}\n${__dirname}/test-cli.js\n${__dirname}/test-runtime.js`
  );
});
