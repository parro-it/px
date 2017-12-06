import test from "ava";
import px from ".";

test("exports a function", t => {
  t.is(typeof px, "function");
});
