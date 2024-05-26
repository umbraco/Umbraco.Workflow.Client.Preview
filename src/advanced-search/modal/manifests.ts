import { WORKFLOW_ITEM_PICKER_MODAL_ALIAS } from "./index.js";

const modalManifests = [
  {
    type: "modal",
    alias: WORKFLOW_ITEM_PICKER_MODAL_ALIAS,
    name: "Workflow Item Picker Modal",
    js: () => import("./item-picker-modal.element.js"),
  },
];

export const manifests = [...modalManifests];
