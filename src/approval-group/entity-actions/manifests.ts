import { WORKFLOW_APPROVALGROUP_ENTITY_TYPE } from "../constants.js";
import { WORKFLOW_APPROVAL_GROUPS_DETAIL_REPOSITORY_ALIAS } from "../repository/detail/constants.js";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "entityAction",
    kind: "delete",
    alias: "Workflow.EntityAction.ApprovalGroup.Delete",
    name: "Delete Approval Group Entity Action",
    api: () => import('./delete.action.js'),
    forEntityTypes: [WORKFLOW_APPROVALGROUP_ENTITY_TYPE],
    meta: {
      repositoryAlias: WORKFLOW_APPROVAL_GROUPS_DETAIL_REPOSITORY_ALIAS,
    },
  },
];
