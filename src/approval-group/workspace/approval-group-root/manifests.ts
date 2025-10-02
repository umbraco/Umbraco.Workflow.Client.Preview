export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "workspace",
    alias: "Workflow.Workspace.ApprovalGroupsRoot",
    name: "Approval Groups Root Workspace",
    element: () => import("./approval-group-root-workspace.element.js"),
    meta: {
      entityType: "approval-group-root",
    },
  },
];
