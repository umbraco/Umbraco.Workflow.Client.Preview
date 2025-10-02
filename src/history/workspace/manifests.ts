import { WORKFLOW_HISTORY_ROOT_ENTITY_TYPE } from "../index.js";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "workspace",
    alias: "Workflow.Workspace.HistoryRoot",
    name: "Workflow History Root Workspace",
    js: () => import("./history-root-workspace.element.js"),
    meta: {
      entityType: WORKFLOW_HISTORY_ROOT_ENTITY_TYPE,
    },
  },
];
