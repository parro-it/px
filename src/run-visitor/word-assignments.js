import createCommandClass from "./create-command-class";

export default prefixes =>
  createCommandClass(({ runtime }) => {
    for (const prefix of prefixes) {
      if (prefix.type === "AssignmentWord") {
        const [name, value] = prefix.text.split("=");
        runtime.variables.set(name, value);
      }
    }
    return 0;
  });
