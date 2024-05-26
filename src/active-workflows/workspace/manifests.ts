import type { ManifestWorkspace } from "@umbraco-cms/backoffice/extension-registry";

const ACTIVE_WORKFLOW_WORKSPACE_ALIAS = "Workflow.Workspace.ActiveWorkflows";
export const ACTIVE_WORKFLOWS_ROOT_ENTITY_TYPE = "active-workflows-root";

const workspace: ManifestWorkspace = {
  type: "workspace",
  alias: ACTIVE_WORKFLOW_WORKSPACE_ALIAS,
  name: "Active Workflows Root Workspace",
  element: () => import("./active-workflows-root-workspace.element.js"),
  meta: {
    entityType: ACTIVE_WORKFLOWS_ROOT_ENTITY_TYPE,
  },
};

export const manifests = [workspace];
