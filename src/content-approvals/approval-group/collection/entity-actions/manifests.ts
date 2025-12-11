import { WORKFLOW_USER_PERMISSION_CONDITION_ALIAS } from "@umbraco-workflow/core";
import { WORKFLOW_APPROVALGROUP_ENTITY_TYPE } from "../../constants.js";
import { WORKFLOW_APPROVALGROUP_DETAIL_REPOSITORY_ALIAS } from "../../repository/detail/constants.js";
import { WORKFLOW_USER_PERMISSION_APPROVALGROUP_DELETE } from "../../user-permissions/constants.js";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "entityAction",
    kind: "delete",
    alias: "Workflow.EntityAction.ApprovalGroup.Delete",
    name: "Delete Approval Group Entity Action",
    api: () => import("./delete.action.js"),
    weight: 200,
    forEntityTypes: [WORKFLOW_APPROVALGROUP_ENTITY_TYPE],
    meta: {
      repositoryAlias: WORKFLOW_APPROVALGROUP_DETAIL_REPOSITORY_ALIAS,
    },
    conditions: [
      {
        alias: WORKFLOW_USER_PERMISSION_CONDITION_ALIAS,
        match: WORKFLOW_USER_PERMISSION_APPROVALGROUP_DELETE,
      },
    ],
  },
  {
    type: "entityAction",
    kind: "default",
    alias: "Workflow.EntityAction.ApprovalGroup.Email",
    name: "Email Approval Group Entity Action",
    js: () => import("./email-group.action.js"),
    weight: 100,
    forEntityTypes: [WORKFLOW_APPROVALGROUP_ENTITY_TYPE],
    meta: {
      label: "#workflow_emailGroup",
      icon: "icon-message",
    },
  },
];
