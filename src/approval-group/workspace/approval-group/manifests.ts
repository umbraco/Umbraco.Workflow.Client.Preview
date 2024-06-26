import { UmbSaveWorkspaceAction } from "@umbraco-cms/backoffice/workspace";
import type {
  ManifestWorkspaces,
  ManifestWorkspaceAction,
  ManifestWorkspaceViews,
} from "@umbraco-cms/backoffice/extension-registry";
import { WORKFLOW_APPROVALGROUP_ENTITY_TYPE } from "../../types.js";

export const WORKFLOW_APPROVALGROUP_WORKSPACE_ALIAS =
  "Workflow.Workspace.ApprovalGroup";

const workspace: ManifestWorkspaces = {
  type: "workspace",
  kind: "routable",
  alias: WORKFLOW_APPROVALGROUP_WORKSPACE_ALIAS,
  name: "Approval Group Workspace",
  api: () => import("./approval-group-workspace.context.js"),
  meta: {
    entityType: WORKFLOW_APPROVALGROUP_ENTITY_TYPE,
  },
};

const workspaceViewData = [
  {
    label: "Settings",
    icon: "settings",
    element: () =>
      import("./views/approval-group-settings-workspace-view.element.js"),
  },
  {
    label: "Members",
    icon: "icon-users",
    element: () =>
      import("./views/approval-group-members-workspace-view.element.js"),
  },
  {
    label: "Roles",
    icon: "icon-keychain",
    element: () =>
      import("./views/approval-group-roles-workspace-view.element.js"),
  },
  {
    label: "History",
    icon: "icon-alarm-clock",
    element: () =>
      import("./views/approval-group-history-workspace-view.element.js"),
  },
];

const workspaceViews: Array<ManifestWorkspaceViews> = workspaceViewData.map(
  (d) => ({
    type: "workspaceView",
    alias: `Umb.WorkspaceView.Workflow.ApprovalGroup.${d.label}`,
    name: `Approval Group Workspace ${d.label} View`,
    element: d.element,
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
    alias: "Workflow.WorkspaceAction.ApprovalGroup.Save",
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
  //   alias: "Workflow.WorkspaceAction.ApprovalGroup.Delete",
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
