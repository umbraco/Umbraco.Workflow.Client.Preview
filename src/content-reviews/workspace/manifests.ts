import { UMB_WORKSPACE_CONDITION_ALIAS } from "@umbraco-cms/backoffice/workspace";
import {
  WORKFLOW_CONTENTREVIEW_ENTITY_TYPE,
  WORKFLOW_CONTENTREVIEWS_ROOT_WORKSPACE_ALIAS,
} from "../constants.js";
import { WORKFLOW_CONTENTREVIEWS_COLLECTION_ALIAS } from "../umbraco-package.js";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "workspace",
    kind: "default",
    alias: WORKFLOW_CONTENTREVIEWS_ROOT_WORKSPACE_ALIAS,
    name: "Content Reviews Root Workspace",
    meta: {
      entityType: WORKFLOW_CONTENTREVIEW_ENTITY_TYPE,
      headline: "#workflow_treeHeaders_contentReviews",
    },
  },
  {
    type: "workspaceView",
    kind: "collection",
    alias: "Workflow.WorkspaceView.ContentReviewsRoot.Collection",
    name: "Workflow Content Reviews Root Collection Workspace View",
    meta: {
      label: "Collection",
      pathname: "collection",
      icon: "icon-layers",
      collectionAlias: WORKFLOW_CONTENTREVIEWS_COLLECTION_ALIAS,
    },
    conditions: [
      {
        alias: UMB_WORKSPACE_CONDITION_ALIAS,
        match: WORKFLOW_CONTENTREVIEWS_ROOT_WORKSPACE_ALIAS,
      },
    ],
  },
];
