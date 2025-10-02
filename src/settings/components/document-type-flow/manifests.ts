import { WORKFLOW_DOCUMENT_TYPE_FLOW_MODAL_ALIAS } from "./modal/document-type-flow-modal.token.js";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "modal",
    alias: WORKFLOW_DOCUMENT_TYPE_FLOW_MODAL_ALIAS,
    name: "Workflow Document Type Flow Modal",
    js: () => import("./modal/document-type-flow-modal.element.js"),
  },
];
