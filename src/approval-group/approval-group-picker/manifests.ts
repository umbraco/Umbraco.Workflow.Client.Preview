import { WORKFLOW_GROUP_PICKER_MODAL_ALIAS } from "./modal/group-picker-modal.token.js";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "modal",
    alias: WORKFLOW_GROUP_PICKER_MODAL_ALIAS,
    name: "Workflow Group Picker Modal",
    js: () => import("./modal/group-picker-modal.element.js"),
  },
];
