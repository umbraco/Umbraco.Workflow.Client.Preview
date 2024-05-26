import type { ManifestModal } from "@umbraco-cms/backoffice/extension-registry";
import { WORKFLOW_EMAIL_SENDTO_MODAL_ALIAS } from "./index.js";

const modalManifests: Array<ManifestModal> = [
  {
    type: "modal",
    alias: WORKFLOW_EMAIL_SENDTO_MODAL_ALIAS,
    name: "Workflow Email Send To Modal",
    js: () => import("./modal/workflow-email-sendto-modal.element.js"),
  },
];

export const manifests = [...modalManifests];
