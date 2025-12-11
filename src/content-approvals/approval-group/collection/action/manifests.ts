import { UMB_COLLECTION_ALIAS_CONDITION } from "@umbraco-cms/backoffice/collection";
import { WORKFLOW_APPROVALGROUP_COLLECTION_ALIAS } from "../constants.js";
import { WORKFLOW_APPROVALGROUP_WORKSPACE_SHOW_CREATE_GROUP_CONDITION_ALIAS } from "../../conditions/constants.js";
import { WORKFLOW_USER_PERMISSION_APPROVALGROUP_CREATE } from "../../user-permissions/constants.js";
import { WORKFLOW_USER_PERMISSION_CONDITION_ALIAS } from "@umbraco-workflow/core";
import { WORKFLOW_CREATE_APPROVALGROUP_WORKSPACE_PATH_PATTERN } from "../../workspace/index.js";

const createPath =
  WORKFLOW_CREATE_APPROVALGROUP_WORKSPACE_PATH_PATTERN.generateAbsolute({});

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "collectionAction",
    kind: "button",
    name: "Create Approval Group Collection Action",
    alias: "Workflow.CollectionAction.ApprovalGroup.Create",
    weight: 200,
    meta: {
      label: "#general_create",
      href: createPath,
    },
    conditions: [
      {
        alias: UMB_COLLECTION_ALIAS_CONDITION,
        match: WORKFLOW_APPROVALGROUP_COLLECTION_ALIAS,
      },
      {
        alias:
          WORKFLOW_APPROVALGROUP_WORKSPACE_SHOW_CREATE_GROUP_CONDITION_ALIAS,
      },
      {
        alias: WORKFLOW_USER_PERMISSION_CONDITION_ALIAS,
        match: WORKFLOW_USER_PERMISSION_APPROVALGROUP_CREATE,
      },
    ],
  },
];
