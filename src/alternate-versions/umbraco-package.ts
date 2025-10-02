export const extensions = [
  {
    name: "Workflow Alternate Versions Bundle",
    alias: "Workflow.Bundle.AlternateVersions",
    type: "bundle",
    js: () => import("./manifests.js"),
  },
];

export * from "./index.js";
