export const WORKFLOW_DOCUMENT_WORKSPACE_VARIANT_SHOW_MARK_REVIEWED_CONDITION =
  "Workflow.Condition.Document.Workspace.ShowMarkReviewed";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "condition",
    name: "Document Workspace Variant Show Mark Reviewed Condition",
    alias: WORKFLOW_DOCUMENT_WORKSPACE_VARIANT_SHOW_MARK_REVIEWED_CONDITION,
    api: () => import("./show-mark-reviewed.condition.js"),
  },
];
