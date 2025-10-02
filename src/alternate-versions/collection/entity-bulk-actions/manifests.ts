import { UMB_COLLECTION_ALIAS_CONDITION } from "@umbraco-cms/backoffice/collection";
import {
  ALTERNATEVERSION_ENTITY_TYPE,
  WORKFLOW_ALTERNATEVERSIONS_COLLECTION_ALIAS,
} from "../../constants.js";
import { WORKFLOW_ALTERNATEVERSIONS_COLLECTION_REPOSITORY_ALIAS } from "../repository/constants.js";
import { WorkflowAlternateVersionCollectionDeleteBulkAction } from "./alternate-version-delete.action.js";
import { WORKFLOW_USER_PERMISSION_ALTERNATEVERSION_DELETE } from "../../user-permissions/constants.js";
import { WORKFLOW_USER_PERMISSION_CONDITION_ALIAS } from "@umbraco-workflow/core";
import { UMB_USER_PERMISSION_DOCUMENT_DELETE } from "@umbraco-cms/backoffice/document";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "entityBulkAction",
    kind: "default",
    name: `Workflow Alternate Version Delete Entity Bulk Action`,
    alias: `Workflow.EntityBulkAction.AlternateVersion.Delete`,
    forEntityTypes: [ALTERNATEVERSION_ENTITY_TYPE],
    meta: {
      label: "#actions_delete",
      repositoryAlias: WORKFLOW_ALTERNATEVERSIONS_COLLECTION_REPOSITORY_ALIAS,
    },
    weight: 100,
    api: WorkflowAlternateVersionCollectionDeleteBulkAction,
    conditions: [
      {
        alias: UMB_COLLECTION_ALIAS_CONDITION,
        match: WORKFLOW_ALTERNATEVERSIONS_COLLECTION_ALIAS,
      },
      {
        alias: WORKFLOW_USER_PERMISSION_CONDITION_ALIAS,
        allOf: [
          WORKFLOW_USER_PERMISSION_ALTERNATEVERSION_DELETE,
          UMB_USER_PERMISSION_DOCUMENT_DELETE,
        ],
      },
    ],
  },
];
