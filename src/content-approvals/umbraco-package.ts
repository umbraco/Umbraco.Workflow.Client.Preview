export const extensions = [
  {
    name: "Workflow Content Approvals Bundle",
    alias: "Workflow.Bundle.ContentApprovals",
    type: "bundle",
    js: () => import("./manifests.js"),
  },
];

export * from "./index.js";
