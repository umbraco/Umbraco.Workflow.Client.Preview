import { WORKFLOW_SETTINGS_ENTITY_TYPE } from "../constants.js";
import { WORKFLOW_SETTINGS_WORKSPACE_ALIAS } from "./constants.js";

export const manifests = [
  {
    type: "workspace",
    kind: "routable",
    alias: WORKFLOW_SETTINGS_WORKSPACE_ALIAS,
    name: "Workflow Settings Workspace",
    api: () => import("./settings-workspace.context.js"),
    meta: {
      entityType: WORKFLOW_SETTINGS_ENTITY_TYPE,
    },
  },
];
