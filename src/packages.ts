import * as activeWorkflowsPackage from "./active-workflows/umbraco-package.js";
import * as advancedSearchPackage from "./advanced-search/umbraco-package.js";
import * as approvalGroupPackage from "./approval-group/umbraco-package.js";
import * as contentReviewsPackage from "./content-reviews/umbraco-package.js";
import * as editorViewPackage from "./editor-view/umbraco-package.js";
import * as historyPackage from "./history/umbraco-package.js";
import * as settingsPackage from "./settings/umbraco-package.js";
import * as contentCalendarPackage from "./content-calendar/umbraco-package.js";
import * as releaseSetsPackage from "./release-sets/umbraco-package.js";
import * as alternateVersionsPackage from './alternate-versions/umbraco-package.js';

export const WORKFLOW_PACKAGES = [
  activeWorkflowsPackage,
  advancedSearchPackage,
  approvalGroupPackage,
  contentReviewsPackage,
  editorViewPackage,
  historyPackage,
  settingsPackage,
  contentCalendarPackage,
  releaseSetsPackage,
  alternateVersionsPackage,
];
