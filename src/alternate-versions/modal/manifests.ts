import {
  WORKFLOW_EXPANDER_COMMENT,
  WORKFLOW_EXPANSION_TYPE_ALIAS,
} from "@umbraco-workflow/core";
import {
  WORKFLOW_ALTERNATEVERSION_SUBMIT_MODAL_ALIAS,
  WORKFLOW_DOCUMENTVERSION_PICKER_MODAL_ALIAS,
} from "./token/index.js";
import { ALTERNATEVERSION_ENTITY_TYPE } from "../constants.js";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "modal",
    alias: WORKFLOW_DOCUMENTVERSION_PICKER_MODAL_ALIAS,
    name: "Workflow Document Version Picker Modal",
    js: () => import("./element/document-version-picker-modal.element.js"),
  },
  {
    type: "modal",
    alias: WORKFLOW_ALTERNATEVERSION_SUBMIT_MODAL_ALIAS,
    name: "Workflow Alternate Version Submit Modal",
    js: () => import("./element/alternate-version-submit-modal.element.js"),
  },
  {
    type: WORKFLOW_EXPANSION_TYPE_ALIAS,
    alias: "Workflow.Expansion.AlternateVersion",
    name: "Workflow Alternate Version Workflow Expansion",
    entityType: ALTERNATEVERSION_ENTITY_TYPE,
    meta: {
      properties: [WORKFLOW_EXPANDER_COMMENT],
    },
  },
];
