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

test("use npm run", async t => {
  const proc = await execa("npm", ["run", "test"], {
    cwd: `${__dirname}/../examples`
  });
  t.is(proc.stdout, `it work!`);
});

test("semicolon", async t => {
  const proc = await execa("npm", ["run", "semicolon"], {
    cwd: `${__dirname}/../examples`
  });
  t.is(proc.stdout, `1\n2`);
});

test("logical and", async t => {
  const proc = await execa("npm", ["run", "and"], {
    cwd: `${__dirname}/../examples`
  });
  t.is(proc.stdout, `1\n2`);
});

test("logical or", async t => {
  const proc = await execa("npm", ["run", "or"], {
    cwd: `${__dirname}/../examples`
  });
  t.is(proc.stdout, `1\n2`);
});
