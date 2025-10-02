export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "workflowInitializer",
    alias: "Workflow.Initializer.Document",
    name: "Workflow Document Workflow Initializer",
    entityType: "document",
    api: () => import("./document-workflow-initializer.controller.js"),
  },
];
