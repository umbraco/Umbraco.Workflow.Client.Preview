import type { ManifestWorkspace } from "@umbraco-cms/backoffice/extension-registry";

const workspace: ManifestWorkspace = {
  type: "workspace",
  alias: "Umb.Workspace.Workflow.ApprovalGroupsRoot",
  name: "Approval Groups Root Workspace",
  js: () => import("./approval-group-root-workspace.element.js"),
  meta: {
    entityType: "approval-group-root",
  },
};

export const manifests = [workspace];
