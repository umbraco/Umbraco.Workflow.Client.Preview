import { UMB_COLLECTION_ALIAS_CONDITION } from "@umbraco-cms/backoffice/collection";
import { WORKFLOW_ALTERNATEVERSIONS_COLLECTION_ALIAS } from "../../constants.js";
import { WORKFLOW_USER_PERMISSION_ALTERNATEVERSION_CREATE } from "../../user-permissions/constants.js";
import { UMB_USER_PERMISSION_DOCUMENT_CREATE } from "@umbraco-cms/backoffice/document";
import { WORKFLOW_USER_PERMISSION_CONDITION_ALIAS } from "@umbraco-workflow/core";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "collectionAction",
    kind: "button",
    name: "Create Document Version Collection Action",
    alias: "Workflow.CollectionAction.AlternateVersions.Create",
    weight: 200,
    meta: {
      label: "#general_create",
    },
    element: () => import("./create-version-collection-action.element.js"),
    conditions: [
      {
        alias: UMB_COLLECTION_ALIAS_CONDITION,
        match: WORKFLOW_ALTERNATEVERSIONS_COLLECTION_ALIAS,
      },
      {
        alias: WORKFLOW_USER_PERMISSION_CONDITION_ALIAS,
        allOf: [WORKFLOW_USER_PERMISSION_ALTERNATEVERSION_CREATE, UMB_USER_PERMISSION_DOCUMENT_CREATE],
      },
    ],
  },
];
