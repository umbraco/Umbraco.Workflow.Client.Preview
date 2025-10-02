import { WORKFLOW_TEXT_MODAL_ALIAS } from "./text/workflow-text-modal.token.js";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "modal",
    alias: WORKFLOW_TEXT_MODAL_ALIAS,
    name: "Workflow Text Modal",
    js: () => import("./text/workflow-text-modal.element.js"),
  },
];