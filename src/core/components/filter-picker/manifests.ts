import type { ManifestModal } from "@umbraco-cms/backoffice/extension-registry";
import { WORKFLOW_FILTER_PICKER_MODAL_ALIAS } from "./modal/filter-picker-modal.token.js";

const modalManifests: Array<ManifestModal> = [
  {
    type: "modal",
    alias: WORKFLOW_FILTER_PICKER_MODAL_ALIAS,
    name: "Workflow Filter Picker Modal",
    js: () =>
      import(
        "./modal/filter-picker-modal.element.js"
      ),
  },
];

export const manifests = [...modalManifests];
