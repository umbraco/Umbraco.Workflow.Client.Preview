export const extensions = [
  {
    name: "Workflow Content Calendar Bundle",
    alias: "Workflow.Bundle.ContentCalendar",
    type: "bundle",
    js: () => import("./manifests.js"),
  },
];

export * from "./index.js";
