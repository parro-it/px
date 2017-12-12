import test from "ava";
import runtimeFactory from "../src/runtime";
import fs from "fs";
import { promisify } from "util";
import px from "..";
import { tmpdir } from "os";
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
  const proc = runtime.run("echo ciao\n", false);
  t.is(await proc.stdout.utf8String(), "ciao");
});

test("understand logical and command", async t => {
  const runtime = runtimeFactory();
  const proc = runtime.run(
    "echo -n 1 && echo -n 2 && false && echo -n 3",
    false
  );
  t.is(await proc.stdout.utf8String(), "12");
});

const trim = promisedString => promisedString.then(s => s.trim());

test.only("redirect stdout", async t => {
  const runtime = runtimeFactory();
  const tmpFile = join(tmpdir(), "piper42");
  console.error(tmpFile);
  await unlink(tmpFile).catch(() => 0);

  const proc = runtime.run(`echo aa df ab ff > ${tmpFile}`, false);

  await proc.exitCode;
  t.is(await trim(readFile(tmpFile, "utf8")), "aa df ab ff");
});

test("redirect stdin", async t => {
  const runtime = runtimeFactory();
  await unlink(join(tmpdir(), "piper42bis")).catch(() => 0);

  await writeFile(join(tmpdir(), "piper42bis"), "aa df ab ff");
  const proc = runtime.run(`wc -w < ${join(tmpdir(), "piper42bis")}`, false);

  const ret = await proc.stdout.utf8String();
  t.is(ret, "4");
});
