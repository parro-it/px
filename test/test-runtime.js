import test from "ava";
import runtimeFactory from "../src/runtime";
import fs from "fs";
import { promisify } from "util";
import px from "..";
import { join } from "path";

test("exports a function", t => {
  t.is(typeof px, "function");
});

const [writeFile, readFile, unlink] = [
  fs.writeFile,
  fs.readFile,
  fs.unlink
].map(promisify);

test("result has stdin/stdout/stderr", t => {
  t.is(typeof runtimeFactory, "function");
});

test("create a runtime object", t => {
  const runtime = runtimeFactory();
  t.is(typeof runtime, "object");
});

test("run simple commands", async t => {
  const runtime = runtimeFactory();
  const proc = runtime.run("node -p '`ciao`'", false);
  t.is(await proc.stdout.utf8String(), "ciao");
});

test("understand logical and command", async t => {
  const runtime = runtimeFactory();
  const proc = runtime.run(
    "node -p 1 && node -p 2 && node -e 'process.exit(1)' && node -p 3",
    false
  );
  t.is(await proc.stdout.utf8String(), "1\n2");
});

const trim = promisedString => promisedString.then(s => s.trim());

test("redirect stdout", async t => {
  const runtime = runtimeFactory();
  const tmpFile = join(__dirname, "piper42");
  await unlink(tmpFile).catch(() => 0);

  const proc = runtime.run(
    `node -p '"aa df ab ff"' > ${tmpFile.replace(/\\/g, "/")}`,
    true
  );

  await proc.exitCode;
  const result = await trim(readFile(tmpFile, "utf8"));
  t.is(result, "aa df ab ff");
  await unlink(tmpFile).catch(() => 0);
});

test("redirect stdin", async t => {
  const runtime = runtimeFactory();
  const tmpFile = join(__dirname, "piper42bis");

  await unlink(tmpFile).catch(() => 0);

  await writeFile(tmpFile, "aa df ab ff");
  const proc = runtime.run(
    `node -e 'process.stdin.pipe(process.stdout)' < ${tmpFile.replace(
      /\\/g,
      "/"
    )}`,
    false
  );

  const ret = await proc.stdout.utf8String();
  await unlink(tmpFile).catch(() => 0);
  t.is(ret, "aa df ab ff");
});
