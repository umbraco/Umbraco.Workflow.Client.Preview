import {
  WORKFLOW_CONTENTREVIEWS_CONFIG_MODAL_ALIAS,
  WORKFLOW_CONTENTREVIEWS_REGENERATE_MODAL_ALIAS,
  WORKFLOW_CONTENTREVIEWS_REVIEW_MODAL_ALIAS,
} from "./token/index.js";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "modal",
    alias: WORKFLOW_CONTENTREVIEWS_CONFIG_MODAL_ALIAS,
    name: "Workflow Content Reviews Config Modal",
    js: () => import("./element/content-reviews-config-modal.element.js"),
  },
  {
    type: "modal",
    alias: WORKFLOW_CONTENTREVIEWS_REGENERATE_MODAL_ALIAS,
    name: "Workflow Content Reviews Regenerate Modal",
    js: () => import("./element/content-reviews-regenerate-modal.element.js"),
  },
  {
    type: "modal",
    alias: WORKFLOW_CONTENTREVIEWS_REVIEW_MODAL_ALIAS,
    name: "Workflow Content Reviews Review Modal",
    js: () => import("./element/content-reviews-review-modal.element.js"),
  },
];
