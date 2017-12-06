import { externalProcess } from "./external-process";
import wordAssignments from "./word-assignments";

export const command = () => {
  return node => {
    if (node.name === null) {
      node.process = wordAssignments(node.prefix);
    } else {
      node.process = externalProcess(node);
    }

    return node;
  };
};
