import { UMB_WORKSPACE_PATH_PATTERN } from "@umbraco-cms/backoffice/workspace";
import { WORKFLOW_APPROVALGROUP_ENTITY_TYPE } from "../../constants.js";
import { WORKFLOW_SECTION_PATHNAME } from "@umbraco-workflow/core";
import { UmbPathPattern } from "@umbraco-cms/backoffice/router";

export const WORKFLOW_APPROVALGROUP_WORKSPACE_PATH =
  UMB_WORKSPACE_PATH_PATTERN.generateAbsolute({
    sectionName: WORKFLOW_SECTION_PATHNAME,
    entityType: WORKFLOW_APPROVALGROUP_ENTITY_TYPE,
  });

export const WORKFLOW_EDIT_APPROVALGROUP_WORKSPACE_PATH_PATTERN =
  new UmbPathPattern<{
    unique: string;
  }>("edit/:unique", WORKFLOW_APPROVALGROUP_WORKSPACE_PATH);

export const WORKFLOW_CREATE_APPROVALGROUP_WORKSPACE_PATH_PATTERN =
  new UmbPathPattern("create", WORKFLOW_APPROVALGROUP_WORKSPACE_PATH);
