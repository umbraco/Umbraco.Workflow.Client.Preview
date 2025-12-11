import {
  ManifestWorkspace,
  MetaWorkspace,
  MetaWorkspaceRoutableKind,
  UmbSubmittableWorkspaceContext,
} from "@umbraco-cms/backoffice/workspace";
import {
  WORKFLOW_SETTINGS_WORKSPACE_KIND,
  WORKFLOW_SETTINGS_WORKSPACE_PROVIDER,
} from "./constants.js";
import { UmbControllerHostElement } from "@umbraco-cms/backoffice/controller-api";
import { ManifestApi } from "@umbraco-cms/backoffice/extension-api";

export type WorkflowSettingsWorkspaceKind =
  typeof WORKFLOW_SETTINGS_WORKSPACE_KIND;

export type WorkflowSettingsWorkspaceProvider =
  typeof WORKFLOW_SETTINGS_WORKSPACE_PROVIDER;

export interface ManifestWorkflowSettingsWorkspaceProvider extends ManifestApi {
  type: WorkflowSettingsWorkspaceProvider;
  meta: MetaWorkflowSettingsWorkspaceProvider;
}

export interface MetaWorkflowSettingsWorkspaceProvider {
  entityType: string;
  label: string;
}

export interface ManifestWorkflowSettingsWorkspaceKind
  extends ManifestWorkspace<
    MetaWorkspaceRoutableKind,
    UmbControllerHostElement,
    UmbSubmittableWorkspaceContext
  > {
  type: "workspace";
  kind: WorkflowSettingsWorkspaceKind;
  meta: MetaWorkflowSettingsWorkspace;
}

export interface MetaWorkflowSettingsWorkspace extends MetaWorkspace {
  label: string;
  pathname: string;
  icon: string | null;
  settingsEntityType: string;
  apiAlias: string;
}

declare global {
  interface UmbExtensionManifestMap {
    manifestWorkflowSettingsWorkspaceKind: ManifestWorkflowSettingsWorkspaceKind;
    manifestWorkflowSettingsWorkspaceProvider: ManifestWorkflowSettingsWorkspaceProvider;
  }
}
