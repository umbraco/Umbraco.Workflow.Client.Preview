import {
  UmbSubmitWorkspaceAction,
  UMB_WORKSPACE_CONDITION_ALIAS,
} from "@umbraco-cms/backoffice/workspace";
import { WORKFLOW_APPROVALGROUP_ENTITY_TYPE, WORKFLOW_APPROVALGROUP_WORKSPACE_ALIAS } from "../../constants.js";

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
    icon: "icon-users",
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
  {
    label: "#general_history",
    pathname: "history",
    icon: "icon-alarm-clock",
    element: () =>
      import("./views/approval-group-history-workspace-view.element.js"),
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
    ],
  },
];
