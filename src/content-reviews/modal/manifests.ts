import type { ManifestModal } from "@umbraco-cms/backoffice/extension-registry";
import {
  WORKFLOW_CONTENTREVIEWS_CONFIG_MODAL_ALIAS,
  WORKFLOW_CONTENTREVIEWS_REGENERATE_MODAL_ALIAS,
} from "./token/index.js";

const modalManifests: Array<ManifestModal> = [
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
];

export const manifests = [...modalManifests];
