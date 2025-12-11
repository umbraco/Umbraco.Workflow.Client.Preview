export const extensions = [
  {
    name: "Workflow Document Bundle",
    alias: "Workflow.Bundle.Document",
    type: "bundle",
    js: () => import("./manifests.js"),
  },
];

export * from "./index.js";
