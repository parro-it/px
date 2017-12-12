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

async function runNpm(...args) {
  try {
    const proc = await execa("npm", ["run"].concat(args), {
      cwd: `${__dirname}/../examples`
    });
    console.error(proc.stderr);
    return proc.stdout;
  } catch (err) {
    console.error(err);
  }
}

test.before("install examples deps", async () => {
  await execa("npm", ["--silent", "install"], {
    cwd: `${__dirname}/../examples`
  });
});

test("use npm run", async t => {
  t.is(await runNpm("test"), `it work!`);
});

test("semicolon", async t => {
  t.is(await runNpm("semicolon"), `1\n2`);
});

test("logical and", async t => {
  t.is(await runNpm("and"), `1\n2`);
});

test("logical or", async t => {
  t.is(await runNpm("or"), `1\n2`);
});

test("setting env variable", async t => {
  t.is(await runNpm("env"), `42`);
});

test("asynchronous execution of a process", async t => {
  t.is(await runNpm("parallel"), `1\n2`);
});
