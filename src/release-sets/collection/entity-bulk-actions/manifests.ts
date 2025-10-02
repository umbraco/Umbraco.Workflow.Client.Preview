import { UMB_COLLECTION_ALIAS_CONDITION } from "@umbraco-cms/backoffice/collection";
import {
  WORKFLOW_RELEASESETS_COLLECTION_ALIAS,
  WORKFLOW_RELEASESETS_COLLECTION_REPOSITORY_ALIAS,
} from "../constants.js";
import { RELEASESET_ENTITY_TYPE } from "../../constants.js";
import { WorkflowReleaseSetCollectionDeleteBulkAction } from "./release-set-delete.action.js";
import { WORKFLOW_USER_PERMISSION_RELEASESET_DELETE } from "../../user-permissions/constants.js";
import { WORKFLOW_USER_PERMISSION_CONDITION_ALIAS } from "@umbraco-workflow/core";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "entityBulkAction",
    kind: "default",
    name: `Workflow Release Set Delete Entity Bulk Action`,
    alias: `Workflow.EntityBulkAction.ReleaseSets.Delete`,
    forEntityTypes: [RELEASESET_ENTITY_TYPE],
    meta: {
      label: "#actions_delete",
      repositoryAlias: WORKFLOW_RELEASESETS_COLLECTION_REPOSITORY_ALIAS,
    },
    weight: 100,
    api: WorkflowReleaseSetCollectionDeleteBulkAction,
    conditions: [
      {
        alias: UMB_COLLECTION_ALIAS_CONDITION,
        match: WORKFLOW_RELEASESETS_COLLECTION_ALIAS,
      },
      {
        alias: WORKFLOW_USER_PERMISSION_CONDITION_ALIAS,
        match: WORKFLOW_USER_PERMISSION_RELEASESET_DELETE,
      },
    ],
  },
];
