import { UMB_WORKSPACE_PATH_PATTERN } from "@umbraco-cms/backoffice/workspace";
import { WORKFLOW_APPROVALGROUP_ROOT_ENTITY_TYPE } from "../../constants.js";
import { WORKFLOW_SECTION_PATHNAME } from "../../../../core/constants.js";

export const WORKFLOW_APPROVALGROUP_ROOT_WORKSPACE_PATH =
  UMB_WORKSPACE_PATH_PATTERN.generateAbsolute({
    sectionName: WORKFLOW_SECTION_PATHNAME,
    entityType: WORKFLOW_APPROVALGROUP_ROOT_ENTITY_TYPE,
  });
