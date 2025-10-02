export const extensions = [
  {
    name: "Workflow Release Sets Bundle",
    alias: "Workflow.Bundle.ReleaseSets",
    type: "bundle",
    js: () => import("./manifests.js"),
  },
];

export * from "./index.js";
