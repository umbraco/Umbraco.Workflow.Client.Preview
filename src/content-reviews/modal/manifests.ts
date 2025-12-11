import { WORKFLOW_CONTENTREVIEWS_REVIEW_MODAL_ALIAS } from "./token/index.js";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "modal",
    alias: WORKFLOW_CONTENTREVIEWS_REVIEW_MODAL_ALIAS,
    name: "Workflow Content Reviews Review Modal",
    js: () => import("./element/content-reviews-review-modal.element.js"),
  },
];
