import type { ManifestWorkspace } from "@umbraco-cms/backoffice/extension-registry";
import { ACTIVE_WORKFLOWS_ROOT_ENTITY_TYPE } from "../index.js";

const workspaceAlias = "Workflow.Workspace.ActiveWorkflows";

const workspace: ManifestWorkspace = {
  type: "workspace",
  alias: workspaceAlias,
  name: "Active Workflows Root Workspace",
  js: () => import("./active-workflows-root-workspace.element.js"),
  meta: {
    entityType: ACTIVE_WORKFLOWS_ROOT_ENTITY_TYPE,
  },
};

export const manifests = [workspace];
