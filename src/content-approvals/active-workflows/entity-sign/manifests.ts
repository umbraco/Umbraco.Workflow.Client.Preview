import { UMB_DOCUMENT_ENTITY_TYPE } from "@umbraco-cms/backoffice/document";
import { WORKFLOW_PENDING_APPROVAL_FLAG } from "./constants.js";
import { ManifestEntitySign } from "@umbraco-cms/backoffice/entity-sign";
import { WORKFLOW_ACTIVEWORKFLOWS_ICON } from "../constants.js";

export const manifests: Array<ManifestEntitySign> = [
  {
    type: "entitySign",
    kind: "icon",
    alias: "Workflow.EntitySign.Document.HasPendingApproval",
    name: "Has Pending Workflow Approval Document Entity Sign",
    forEntityTypes: [UMB_DOCUMENT_ENTITY_TYPE],
    forEntityFlags: [WORKFLOW_PENDING_APPROVAL_FLAG],
    meta: {
      iconName: WORKFLOW_ACTIVEWORKFLOWS_ICON,
      label: "Pending workflow approval",
    },
  },
];
