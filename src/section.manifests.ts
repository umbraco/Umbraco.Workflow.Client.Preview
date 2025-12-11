import { WORKFLOW_USER_PERMISSION_HISTORY_READ } from "@umbraco-workflow/history";
import { WORKFLOW_USER_PERMISSION_ACTIVEWORKFLOWS_READ } from "@umbraco-workflow/active-workflows";
import { WORKFLOW_USER_PERMISSION_APPROVALGROUP_READ } from "@umbraco-workflow/approval-group";
import { WORKFLOW_USER_PERMISSION_CONTENTREVIEW_READ } from "@umbraco-workflow/content-reviews";
import {
  UMB_SECTION_ALIAS_CONDITION_ALIAS,
  UMB_SECTION_USER_PERMISSION_CONDITION_ALIAS,
} from "@umbraco-cms/backoffice/section";
import {
  WORKFLOW_USER_PERMISSION_CONDITION_ALIAS,
  WORKFLOW_SECTION_ALIAS,
  WORKFLOW_SECTION_MENU_ALIAS,
  WORKFLOW_SECTION_PATHNAME,
} from "@umbraco-workflow/core";

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "section",
    alias: WORKFLOW_SECTION_ALIAS,
    name: "Workflow Section",
    weight: 0,
    meta: {
      label: "#workflow_workflow",
      pathname: WORKFLOW_SECTION_PATHNAME,
    },
    conditions: [
      {
        alias: UMB_SECTION_USER_PERMISSION_CONDITION_ALIAS,
        match: WORKFLOW_SECTION_ALIAS,
      },
    ],
  },
  {
    type: "menu",
    alias: WORKFLOW_SECTION_MENU_ALIAS,
    name: "Workflow Menu",
  },
  {
    type: "sectionSidebarApp",
    kind: "menu",
    alias: "Umb.SectionSidebarMenu.Workflow",
    name: "Workflow Section Sidebar Menu",
    weight: 200,
    meta: {
      label: "#workflow_workflow",
      menu: WORKFLOW_SECTION_MENU_ALIAS,
    },
    conditions: [
      {
        alias: UMB_SECTION_ALIAS_CONDITION_ALIAS,
        match: WORKFLOW_SECTION_ALIAS,
      },
      {
        alias: WORKFLOW_USER_PERMISSION_CONDITION_ALIAS,
        oneOf: [
          WORKFLOW_USER_PERMISSION_ACTIVEWORKFLOWS_READ,
          WORKFLOW_USER_PERMISSION_HISTORY_READ,
          WORKFLOW_USER_PERMISSION_CONTENTREVIEW_READ,
          WORKFLOW_USER_PERMISSION_APPROVALGROUP_READ,
        ],
      },
    ],
  },
];
