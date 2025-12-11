import {
  ManifestWithDynamicConditions,
  ManifestWithView,
} from "@umbraco-cms/backoffice/extension-api";
import {
  MetaWorkspaceView,
  UmbWorkspaceViewElement,
} from "@umbraco-cms/backoffice/workspace";

export const WORKFLOW_WORKSPACE_TAB = "workflowWorkspaceTab";

export type WorkflowWorkspaceTab = typeof WORKFLOW_WORKSPACE_TAB;

export interface ManifestWorkflowWorkspaceTab
  extends ManifestWithView<UmbWorkspaceViewElement>,
    ManifestWithDynamicConditions<UmbExtensionConditionConfig> {
  type: WorkflowWorkspaceTab;
  forEntityType: string;
  meta: MetaWorkspaceView;
}

declare global {
  interface UmbExtensionManifestMap {
    ManifestWorkflowWorkspaceTab: ManifestWorkflowWorkspaceTab;
  }
}
