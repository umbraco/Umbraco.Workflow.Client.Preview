import { UMB_COLLECTION_ALIAS_CONDITION } from "@umbraco-cms/backoffice/collection";
import { WORKFLOW_APPROVALGROUP_COLLECTION_ALIAS } from "../constants.js";
import { WORKFLOW_APPROVAL_GROUP_WORKSPACE_SHOW_CREATE_GROUP_CONDITION_ALIAS } from "../../conditions/constants.js";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "collectionAction",
    kind: "button",
    name: "Create Approval Group Collection Action",
    alias: "Workflow.CollectionAction.ApprovalGroup.Create",
    weight: 200,
    meta: {
      label: "#general_create",
      href: "section/workflow/workspace/approval-group/create",
    },
    conditions: [
      {
        alias: UMB_COLLECTION_ALIAS_CONDITION,
        match: WORKFLOW_APPROVALGROUP_COLLECTION_ALIAS,
      },
      {
        alias: WORKFLOW_APPROVAL_GROUP_WORKSPACE_SHOW_CREATE_GROUP_CONDITION_ALIAS,
      },
    ],
  },
];
