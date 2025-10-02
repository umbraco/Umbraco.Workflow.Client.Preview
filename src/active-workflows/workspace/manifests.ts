import { ACTIVE_WORKFLOWS_ROOT_ENTITY_TYPE } from "../constants.js";

export const manifests: Array<UmbExtensionManifest> = [{
  type: "workspace",
  alias: "Workflow.Workspace.ActiveWorkflows",
  name: "Active Workflows Root Workspace",
  element: () => import("./active-workflows-root-workspace.element.js"),
  meta: {
    entityType: ACTIVE_WORKFLOWS_ROOT_ENTITY_TYPE,
  },
}];
