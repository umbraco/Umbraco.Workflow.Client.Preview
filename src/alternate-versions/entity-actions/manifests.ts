import { UMB_WORKSPACE_CONDITION_ALIAS } from "@umbraco-cms/backoffice/workspace";
import {
  ALTERNATEVERSION_DELETE_VISIBILITY_CONDITION_ALIAS,
  ALTERNATEVERSION_MAKECURRENT_VISIBILITY_CONDITION_ALIAS,
} from "../workspace/conditions/constants.js";
import { ALTERNATEVERSION_ENTITY_TYPE,WORKFLOW_ALTERNATEVERSION_WORKSPACE_ALIAS } from "../constants.js";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "entityAction",
    kind: "default",
    name: `Workflow Alternate Version Make Current Entity Bulk Action`,
    alias: `Workflow.EntityAction.AlternateVersion.MakeCurrent`,
    forEntityTypes: [ALTERNATEVERSION_ENTITY_TYPE],
    meta: {
      label: "#workflow_alternateVersions_makeCurrent",
      icon: "icon-globe",
    },
    api: () => import("./alternate-version-make-current.action.js"),
    conditions: [
      {
        alias: UMB_WORKSPACE_CONDITION_ALIAS,
        match: WORKFLOW_ALTERNATEVERSION_WORKSPACE_ALIAS,
      },
      {
        alias: ALTERNATEVERSION_MAKECURRENT_VISIBILITY_CONDITION_ALIAS,
      },
    ],
  },
  {
    type: "entityAction",
    kind: "delete",
    name: `Workflow Alternate Version Delete Entity Action`,
    alias: `Workflow.EntityAction.AlternateVersion.Delete`,
    forEntityTypes: [ALTERNATEVERSION_ENTITY_TYPE],
    meta: {
      label: "#actions_delete",
      icon: "icon-trash",
    },
    api: () => import("./alternate-version-delete.action.js"),
    conditions: [
      {
        alias: UMB_WORKSPACE_CONDITION_ALIAS,
        match: WORKFLOW_ALTERNATEVERSION_WORKSPACE_ALIAS,
      },
      {
        alias: ALTERNATEVERSION_DELETE_VISIBILITY_CONDITION_ALIAS,
      },
    ],
  },
];
