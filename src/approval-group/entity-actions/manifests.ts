import type { ManifestEntityAction } from "@umbraco-cms/backoffice/extension-registry";
import { WORKFLOW_APPROVALGROUP_ENTITY_TYPE } from "../types.js";
import { WORKFLOW_APPROVAL_GROUPS_DETAIL_REPOSITORY_ALIAS } from "../repository/detail/manifests.js";
import { WorkflowDeleteGroupEntityAction } from "./delete.action.js";

const entityActions: Array<ManifestEntityAction> = [
  {
    type: "entityAction",
    kind: "delete",
    alias: "Umb.Workflow.EntityAction.ApprovalGroup.Delete",
    name: "Delete Approval Group Entity Action",
    api: WorkflowDeleteGroupEntityAction,
    forEntityTypes: [WORKFLOW_APPROVALGROUP_ENTITY_TYPE],
    meta: {
      repositoryAlias: WORKFLOW_APPROVAL_GROUPS_DETAIL_REPOSITORY_ALIAS,
    },
  },
];

export const manifests = [...entityActions];
