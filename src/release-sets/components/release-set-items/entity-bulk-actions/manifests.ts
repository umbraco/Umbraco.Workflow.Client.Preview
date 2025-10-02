import { UMB_COLLECTION_ALIAS_CONDITION } from "@umbraco-cms/backoffice/collection";
import { RELEASESET_VERSION_ENTITY_TYPE } from "../../../constants.js";
import { WORKFLOW_RELEASESET_ITEM_COLLECTION_ALIAS } from "../constants.js";
import { WorkflowReleaseSetItemRemoveEntityBulkAction } from "./release-set-item-remove.action.js";

const bulkActionsData = [
  {
    name: "Remove",
    api: WorkflowReleaseSetItemRemoveEntityBulkAction,
  },
];

export const manifests: Array<UmbExtensionManifest> = bulkActionsData.map(
  (action) => ({
    type: "entityBulkAction",
    kind: "default",
    name: `Workflow Release Set ${action.name} Item Entity Bulk Action`,
    alias: `Workflow.EntityBulkAction.ReleaseSetItem.${action.name.replace(
      " ",
      ""
    )}`,
    forEntityTypes: [RELEASESET_VERSION_ENTITY_TYPE],
    meta: {
      label: action.name,
    },
    weight: 100,
    api: action.api,
    conditions: [
      {
        alias: UMB_COLLECTION_ALIAS_CONDITION,
        match: WORKFLOW_RELEASESET_ITEM_COLLECTION_ALIAS,
      },
    ],
  })
);
