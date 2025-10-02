import { WORKFLOW_FILTER_PICKER_MODAL_ALIAS } from "./modal/filter-picker-modal.token.js";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "modal",
    alias: WORKFLOW_FILTER_PICKER_MODAL_ALIAS,
    name: "Workflow Filter Picker Modal",
    js: () => import("./modal/filter-picker-modal.element.js"),
  },
];
