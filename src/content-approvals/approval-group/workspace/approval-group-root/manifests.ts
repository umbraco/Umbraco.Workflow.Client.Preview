import { UMB_WORKSPACE_CONDITION_ALIAS } from "@umbraco-cms/backoffice/workspace";
import { WORKFLOW_APPROVALGROUP_COLLECTION_ALIAS } from "../../collection/constants.js";
import { WORKFLOW_APPROVALGROUP_ROOT_ENTITY_TYPE } from "../../constants.js";
import { WORKFLOW_APPROVALGROUP_ROOT_WORKSPACE_ALIAS } from "./constants.js";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "workspace",
    kind: "default",
    alias: WORKFLOW_APPROVALGROUP_ROOT_WORKSPACE_ALIAS,
    name: "Approval Groups Root Workspace",
    meta: {
      entityType: WORKFLOW_APPROVALGROUP_ROOT_ENTITY_TYPE,
      headline: "#workflow_treeHeaders_approvalGroups",
    },
  },
  {
    type: "workspaceView",
    kind: "collection",
    alias: "Workflow.WorkspaceView.ApprovalGroupRoot.Collection",
    name: "Workflow Approval Groups Root Collection Workspace View",
    meta: {
      label: "Collection",
      pathname: "collection",
      icon: "icon-layers",
      collectionAlias: WORKFLOW_APPROVALGROUP_COLLECTION_ALIAS,
    },
    conditions: [
      {
        alias: UMB_WORKSPACE_CONDITION_ALIAS,
        match: WORKFLOW_APPROVALGROUP_ROOT_WORKSPACE_ALIAS,
      },
    ],
  },
];
