export const extensions = [
  {
    name: "Workflow Advanced Search Bundle",
    alias: "Workflow.Bundle.AdvancedSearch",
    type: "bundle",
    js: () => import("./manifests.js"),
  },
];

export * from "./index.js";