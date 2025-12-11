import {
  UmbSubmitWorkspaceAction,
  UMB_WORKSPACE_CONDITION_ALIAS,
} from "@umbraco-cms/backoffice/workspace";
import { WORKFLOW_USER_PERMISSION_APPROVALGROUP_UPDATE } from "../../user-permissions/constants.js";
import { WORKFLOW_USER_PERMISSION_CONDITION_ALIAS } from "@umbraco-workflow/core";
import {
  WORKFLOW_HISTORY_ICON,
  WORKFLOW_USER_PERMISSION_HISTORY_READ,
} from "@umbraco-workflow/history";
import {
  WORKFLOW_APPROVALGROUP_ICON,
  WORKFLOW_APPROVALGROUP_ENTITY_TYPE,
  WORKFLOW_APPROVALGROUP_WORKSPACE_ALIAS,
} from "../../constants.js";
import { WORKFLOW_HISTORY_COLLECTION_ALIAS } from "src/content-approvals/history/collection/constants.js";

const workspaceViewData = [
  {
    label: "#general_settings",
    pathname: "settings",
    icon: "settings",
    element: () =>
      import("./views/approval-group-settings-workspace-view.element.js"),
  },
  {
    label: "#sections_member",
    pathname: "members",
    icon: WORKFLOW_APPROVALGROUP_ICON,
    element: () =>
      import("./views/approval-group-members-workspace-view.element.js"),
  },
  {
    label: "#workflow_roles",
    pathname: "roles",
    icon: "icon-keychain",
    element: () =>
      import("./views/approval-group-roles-workspace-view.element.js"),
  },
];

const workspaceViews: Array<UmbExtensionManifest> = workspaceViewData.map(
  (d) => ({
    type: "workspaceView",
    alias: `Workflow.WorkspaceView.ApprovalGroup.${d.label}`,
    name: `Approval Group Workspace ${d.label} View`,
    element: d.element,
    weight: 90,
    meta: {
      label: d.label,
      pathname: d.pathname,
      icon: d.icon,
    },
    conditions: [
      {
        alias: UMB_WORKSPACE_CONDITION_ALIAS,
        match: WORKFLOW_APPROVALGROUP_WORKSPACE_ALIAS,
      },
    ],
  })
);

export const manifests: Array<UmbExtensionManifest> = [
  ...workspaceViews,
  {
    type: "workspace",
    kind: "routable",
    alias: WORKFLOW_APPROVALGROUP_WORKSPACE_ALIAS,
    name: "Approval Group Workspace",
    api: () => import("./approval-group-workspace.context.js"),
    meta: {
      entityType: WORKFLOW_APPROVALGROUP_ENTITY_TYPE,
    },
  },
  {
    type: "workspaceView",
    kind: "collection",
    alias: "Workflow.WorkspaceView.ApprovalGroup.History.Collection",
    name: "Workflow Approval Group History Collection Workspace View",
    meta: {
      label: "History",
      pathname: "history",
      icon: WORKFLOW_HISTORY_ICON,
      collectionAlias: WORKFLOW_HISTORY_COLLECTION_ALIAS,
    },
    conditions: [
      {
        alias: UMB_WORKSPACE_CONDITION_ALIAS,
        match: WORKFLOW_APPROVALGROUP_WORKSPACE_ALIAS,
      },
      {
        alias: WORKFLOW_USER_PERMISSION_CONDITION_ALIAS,
        match: WORKFLOW_USER_PERMISSION_HISTORY_READ,
      },
    ],
  },
  {
    type: "workspaceAction",
    kind: "default",
    alias: "Workflow.WorkspaceAction.ApprovalGroup.Save",
    name: "Save Approval Group Workspace Action",
    weight: 100,
    api: UmbSubmitWorkspaceAction,
    meta: {
      look: "primary",
      color: "positive",
      label: "#buttons_save",
    },
    conditions: [
      {
        alias: UMB_WORKSPACE_CONDITION_ALIAS,
        match: WORKFLOW_APPROVALGROUP_WORKSPACE_ALIAS,
      },
      {
        alias: WORKFLOW_USER_PERMISSION_CONDITION_ALIAS,
        match: WORKFLOW_USER_PERMISSION_APPROVALGROUP_UPDATE,
      },
    ],
  },
];
