import { WORKFLOW_APPROVAL_GROUP_WORKSPACE_SHOW_CREATE_GROUP_CONDITION_ALIAS } from "./constants.js";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "condition",
    name: "Approval Group Workspace Show Create Group Condition",
    alias: WORKFLOW_APPROVAL_GROUP_WORKSPACE_SHOW_CREATE_GROUP_CONDITION_ALIAS,
    api: () => import("./show-create-group.condition.js"),
  },
];
