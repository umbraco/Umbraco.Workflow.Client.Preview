import type { ManifestModal } from "@umbraco-cms/backoffice/extension-registry";
import { WORKFLOW_HISTORY_CLEANUP_MODAL_ALIAS } from "./modal/history-cleanup-modal.token.js";

const modalManifests: Array<ManifestModal> = [
  {
    type: "modal",
    alias: WORKFLOW_HISTORY_CLEANUP_MODAL_ALIAS,
    name: "Workflow History Cleanup Modal",
    js: () => import("./modal/history-cleanup-modal.element.js"),
  },
];

export const manifests = [...modalManifests];
