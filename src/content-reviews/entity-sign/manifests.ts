import { UMB_DOCUMENT_ENTITY_TYPE } from "@umbraco-cms/backoffice/document";
import { WORKFLOW_PENDING_REVIEW_FLAG } from "./constants.js";
import { ManifestEntitySign } from "@umbraco-cms/backoffice/entity-sign";
import { WORKFLOW_CONTENTREVIEW_ICON } from "../constants.js";

export const manifests: Array<ManifestEntitySign> = [
  {
    type: "entitySign",
    kind: "icon",
    alias: "Workflow.EntitySign.Document.HasPendingReview",
    name: "Has Pending Workflow Content Review Document Entity Sign",
    forEntityTypes: [UMB_DOCUMENT_ENTITY_TYPE],
    forEntityFlags: [WORKFLOW_PENDING_REVIEW_FLAG],
    meta: {
      iconName: WORKFLOW_CONTENTREVIEW_ICON,
      label: "Pending content review",
    },
  },
];
