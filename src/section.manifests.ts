import { UMB_SECTION_USER_PERMISSION_CONDITION_ALIAS } from "@umbraco-cms/backoffice/section";
import { WORKFLOW_SECTION_ALIAS, WORKFLOW_SECTION_MENU_ALIAS } from './constants.js';

export const manifests: Array<UmbExtensionManifest> = [
  {
    type: "section",
    alias: WORKFLOW_SECTION_ALIAS,
    name: "Workflow Section",
    weight: 0,
    meta: {
      label: "#workflow_workflow",
      pathname: "workflow",
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
        alias: "Umb.Condition.SectionAlias",
        match: WORKFLOW_SECTION_ALIAS,
      },
    ],
  },
];
