import { command } from "./command";
import { Pipeline } from "./pipeline";
import { Script } from "./script";
import { LogicalExpression } from "./logical-expression";

export default runtime => ({
  Command: command(runtime),
  Pipeline,
  Script,
  LogicalExpression
  // Function
  // CompoundList
  // Subshell
  // Case
  // CaseItem
  // If
  // For
  // While
  // Until
});
