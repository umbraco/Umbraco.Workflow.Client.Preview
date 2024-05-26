import type { ManifestModal } from "@umbraco-cms/backoffice/extension-registry";
import { WORKFLOW_GROUP_PICKER_MODAL_ALIAS } from "./modal/group-picker-modal.token.js";

const modalManifests: Array<ManifestModal> = [
  {
    type: "modal",
    alias: WORKFLOW_GROUP_PICKER_MODAL_ALIAS,
    name: "Workflow Group Picker Modal",
    js: () => import("./modal/group-picker-modal.element.js"),
  },
];

export const manifests = [...modalManifests];
