#!/usr/bin/env node
"use strict";
const _require = require("@std/esm")(module, {
  esm: "js",
  cjs: true
});

const runtimeFactory = _require("../src/runtime").default;
const argv = process.argv.slice(2);
const commandIdx = argv.indexOf("-c") + 1;
const command = argv[commandIdx];

if (commandIdx === 0 || !command) {
  console.error(`Usage: px -c "<command>"\n`);
  process.exit(1);
} else {
  const runtime = runtimeFactory();
  const proc = runtime.run(command);
  proc.exitCode.then(code => process.exit(code)).catch(err => {
    console.error(err);
    process.exit(1);
  });
}
