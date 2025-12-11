import { WORKFLOW_DOCUMENT_UNLOCK_VISIBILITY_CONDITION_ALIAS } from "./constants.js";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "condition",
    name: "Workflow Show Document Unlock Condition",
    alias: WORKFLOW_DOCUMENT_UNLOCK_VISIBILITY_CONDITION_ALIAS,
    api: () => import("./show-document-unlock.condition.js"),
  },
];
