import { WORKFLOW_HISTORY_CLEANUP_MODAL_ALIAS } from "./modal/history-cleanup-modal.token.js";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "modal",
    alias: WORKFLOW_HISTORY_CLEANUP_MODAL_ALIAS,
    name: "Workflow History Cleanup Modal",
    js: () => import("./modal/history-cleanup-modal.element.js"),
  },
];
