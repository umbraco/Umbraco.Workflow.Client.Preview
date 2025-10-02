import { UMB_COLLECTION_ALIAS_CONDITION } from "@umbraco-cms/backoffice/collection";
import { RELEASESET_TASK_ENTITY_TYPE } from "../../../constants.js";
import { WORKFLOW_RELEASESET_TASK_COLLECTION_ALIAS } from "../constants.js";
import { WorkflowReleaseSetTaskRemoveEntityBulkAction } from "./release-set-task-remove.action.js";
import { WorkflowReleaseSetTaskUpdateStatusEntityBulkAction } from "./release-set-task-update-status.action.js";

const bulkActionsData = [
  {
    name: "#workflow_releaseSets_remove",
    api: WorkflowReleaseSetTaskRemoveEntityBulkAction,
  },
  {
    name: "#workflow_releaseSets_updateStatus",
    api: WorkflowReleaseSetTaskUpdateStatusEntityBulkAction,
  },
];

export const manifests: Array<UmbExtensionManifest> = bulkActionsData.map(
  (action) => ({
    type: "entityBulkAction",
    kind: "default",
    name: `Workflow Release Set ${action.name} Task Entity Bulk Action`,
    alias: `Workflow.EntityBulkAction.ReleaseSetTask.${action.name.replace(
      " ",
      ""
    )}`,
    forEntityTypes: [RELEASESET_TASK_ENTITY_TYPE],
    meta: {
      label: action.name,
    },
    weight: 100,
    api: action.api,
    conditions: [
      {
        alias: UMB_COLLECTION_ALIAS_CONDITION,
        match: WORKFLOW_RELEASESET_TASK_COLLECTION_ALIAS,
      },
    ],
  })
);
