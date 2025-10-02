export const extensions = [
  {
    name: "Workflow Editor View Bundle",
    alias: "Workflow.Bundle.EditorView",
    type: "bundle",
    js: () => import("./manifests.js"),
  },
];
