import test from "ava";
import runtimeFactory from "../src/runtime";
import fs from "fs";
import { promisify } from "util";
import px from "..";

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

test("redirect stdout", async t => {
  const runtime = runtimeFactory();
  await unlink(`/tmp/piper42`).catch(() => 0);

  const proc = runtime.run("echo aa df ab ff | wc -w > /tmp/piper42", false);

  await proc.exitCode;
  t.is(await trim(readFile(`/tmp/piper42`, "utf8")), "4");
});

test("redirect stdin", async t => {
  const runtime = runtimeFactory();
  await unlink(`/tmp/piper42bsi`).catch(() => 0);
  await writeFile(`/tmp/piper42bsi`, "aa df ab ff");
  const proc = runtime.run("wc -w < /tmp/piper42bsi", false);

  const ret = await proc.stdout.utf8String();
  t.is(ret, "4");
});