import { WORKFLOW_CONFIRM_DELETE_GROUP_MODAL_ALIAS } from "./token/confirm-delete-group-modal.token.js";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "modal",
    alias: WORKFLOW_CONFIRM_DELETE_GROUP_MODAL_ALIAS,
    name: "Workflow Confirm Delete Group Modal",
    js: () => import("./element/confirm-delete-group-modal.element.js"),
  },
];
