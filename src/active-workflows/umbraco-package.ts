export const extensions = [
  {
    name: "Workflow Active Workflows Bundle",
    alias: "Workflow.Bundle.ActiveWorkflows",
    type: "bundle",
    js: () => import('./manifests.js'),
  },
];
