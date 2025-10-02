import { WORKFLOW_EMAIL_SENDTO_MODAL_ALIAS } from "./index.js";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "modal",
    alias: WORKFLOW_EMAIL_SENDTO_MODAL_ALIAS,
    name: "Workflow Email Send To Modal",
    js: () => import("./modal/workflow-email-sendto-modal.element.js"),
  },
];
