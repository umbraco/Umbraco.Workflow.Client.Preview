import { UmbSaveWorkspaceAction } from "@umbraco-cms/backoffice/workspace";
import type {
  ManifestWorkspace,
  ManifestWorkspaceAction,
  ManifestWorkspaceView,
} from "@umbraco-cms/backoffice/extension-registry";
import { WorkflowDeleteGroupEntityAction } from "../../entity-actions/delete.action.js";
import { WORKFLOW_APPROVALGROUP_ENTITY_TYPE } from "../../types.js";

export const WORKFLOW_APPROVALGROUP_WORKSPACE_ALIAS =
  "Umb.Workspace.Workflow.ApprovalGroup";

const workspace: ManifestWorkspace = {
  type: "workspace",
  alias: WORKFLOW_APPROVALGROUP_WORKSPACE_ALIAS,
  name: "Approval Group Workspace",
  js: () => import("./approval-group-workspace.element.js"),
  meta: {
    entityType: WORKFLOW_APPROVALGROUP_ENTITY_TYPE,
  },
};

const workspaceViewData = [
  {
    label: "Settings",
    icon: "settings",
    js: () =>
      import("./views/approval-group-settings-workspace-view.element.js"),
  },
  {
    label: "Members",
    icon: "icon-users",
    js: () =>
      import("./views/approval-group-members-workspace-view.element.js"),
  },
  {
    label: "Roles",
    icon: "icon-keychain",
    js: () => import("./views/approval-group-roles-workspace-view.element.js"),
  },
  {
    label: "History",
    icon: "icon-alarm-clock",
    js: () =>
      import("./views/approval-group-history-workspace-view.element.js"),
  },
];

const workspaceViews: Array<ManifestWorkspaceView> = workspaceViewData.map(
  (d) => ({
    type: "workspaceView",
    alias: `Umb.WorkspaceView.Workflow.ApprovalGroup.${d.label}`,
    name: `Approval Group Workspace ${d.label} View`,
    js: d.js,
    weight: 90,
    meta: {
      label: d.label,
      pathname: d.label.toLowerCase(),
      icon: d.icon,
    },
    conditions: [
      {
        alias: "Umb.Condition.WorkspaceAlias",
        match: WORKFLOW_APPROVALGROUP_WORKSPACE_ALIAS,
      },
    ],
  })
);

const workspaceActions: Array<ManifestWorkspaceAction> = [
  {
    type: "workspaceAction",
    kind: "default",
    alias: "Umb.WorkspaceAction.Workflow.ApprovalGroup.Save",
    name: "Save Approval Group Workspace Action",
    weight: 100,
    api: UmbSaveWorkspaceAction,
    meta: {
      look: "primary",
      color: "positive",
      label: "Save",
    },
    conditions: [
      {
        alias: "Umb.Condition.WorkspaceAlias",
        match: WORKFLOW_APPROVALGROUP_WORKSPACE_ALIAS,
      },
    ],
  },
  // {
  //   type: "workspaceAction",
  //   kind: "default",
  //   alias: "Umb.WorkspaceAction.Workflow.ApprovalGroup.Delete",
  //   name: "Save Approval Group Workspace Delete",
  //   api: WorkflowDeleteGroupEntityAction,
  //   meta: {
  //     look: "primary",
  //     color: "danger",
  //     label: "Delete",
  //   },
  //   weight: 200,
  //   conditions: [
  //     {
  //       alias: "Umb.Condition.WorkspaceAlias",
  //       match: WORKFLOW_APPROVALGROUP_WORKSPACE_ALIAS,
  //     },
  //   ],
  // },
];

export const manifests = [workspace, ...workspaceViews, ...workspaceActions];
