import type { ManifestWorkspace } from "@umbraco-cms/backoffice/extension-registry";
import { WORKFLOW_HISTORY_ROOT_ENTITY_TYPE } from "../index.js";

const workspaceAlias = "Umb.Workspace.Workflow.HistoryRoot";

const workspace: ManifestWorkspace = {
  type: "workspace",
  alias: workspaceAlias,
  name: "Workflow History Root Workspace",
  js: () => import("./history-root-workspace.element.js"),
  meta: {
    entityType: WORKFLOW_HISTORY_ROOT_ENTITY_TYPE,
  },
};

export const manifests = [workspace];
