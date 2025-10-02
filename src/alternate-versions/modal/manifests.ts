import {
  WORKFLOW_ALTERNATEVERSION_SUBMIT_MODAL_ALIAS,
  WORKFLOW_DOCUMENTVERSION_PICKER_MODAL_ALIAS,
} from "./token/index.js";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "modal",
    alias: WORKFLOW_DOCUMENTVERSION_PICKER_MODAL_ALIAS,
    name: "Workflow Document Version Picker Modal",
    js: () => import("./element/document-version-picker-modal.element.js"),
  },
  {
    type: "modal",
    alias: WORKFLOW_ALTERNATEVERSION_SUBMIT_MODAL_ALIAS,
    name: "Workflow Alternate Version Submit Modal",
    js: () => import("./element/alternate-version-submit-modal.element.js"),
  },
];
