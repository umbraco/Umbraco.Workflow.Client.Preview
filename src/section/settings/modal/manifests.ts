import type { ManifestModal } from "@umbraco-cms/backoffice/extension-registry";
import {
  WORKFLOW_DOCUMENT_TYPE_FLOW_MODAL_ALIAS,
  WORKFLOW_EMAIL_SENDTO_MODAL_ALIAS,
} from "./token/index.js";

const modalManifests: Array<ManifestModal> = [
  {
    type: "modal",
    alias: WORKFLOW_EMAIL_SENDTO_MODAL_ALIAS,
    name: "Workflow Email Send To Modal",
    js: () => import("./element/workflow-email-sendto-modal.element.js"),
  },
  {
    type: "modal",
    alias: WORKFLOW_DOCUMENT_TYPE_FLOW_MODAL_ALIAS,
    name: "Workflow Document Type Flow Modal",
    js: () => import("./element/document-type-flow-modal.element.js"),
  },
];

export const manifests = [...modalManifests];
