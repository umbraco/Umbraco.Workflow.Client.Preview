import { UMB_SETTINGS_SECTION_PATHNAME } from "@umbraco-cms/backoffice/settings";
import { UMB_WORKSPACE_PATH_PATTERN } from "@umbraco-cms/backoffice/workspace";
import { WORKFLOW_SETTINGS_ENTITY_TYPE } from "./constants.js";
import { UmbPathPattern } from "@umbraco-cms/backoffice/router";

export const WORKFLOW_SETTINGS_WORKSPACE_PATH =
  UMB_WORKSPACE_PATH_PATTERN.generateAbsolute({
    sectionName: UMB_SETTINGS_SECTION_PATHNAME,
    entityType: WORKFLOW_SETTINGS_ENTITY_TYPE,
  });

export const WORKFLOW_EDIT_SETTINGS_WORKSPACE_PATH = new UmbPathPattern<{
  unique: string;
}>("edit/:unique", WORKFLOW_SETTINGS_WORKSPACE_PATH);
