import { UMB_COLLECTION_ALIAS_CONDITION } from "@umbraco-cms/backoffice/collection";
import { WORKFLOW_RELEASESETS_COLLECTION_ALIAS } from "../constants.js";
import { WORKFLOW_USER_PERMISSION_RELEASESET_CREATE } from "../../user-permissions/constants.js";
import { WORKFLOW_USER_PERMISSION_CONDITION_ALIAS } from "@umbraco-workflow/core";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "collectionAction",
    kind: "button",
    name: "Create Release Set Collection Action",
    alias: "Workflow.CollectionAction.ReleaseSet.Create",
    weight: 200,
    meta: {
      label: "#general_create",
    },
    element: () => import("./create-release-set-collection-action.element.js"),
    conditions: [
      {
        alias: UMB_COLLECTION_ALIAS_CONDITION,
        match: WORKFLOW_RELEASESETS_COLLECTION_ALIAS,
      },
      {
        alias: WORKFLOW_USER_PERMISSION_CONDITION_ALIAS,
        match: WORKFLOW_USER_PERMISSION_RELEASESET_CREATE,
      }
    ],
  },
];
