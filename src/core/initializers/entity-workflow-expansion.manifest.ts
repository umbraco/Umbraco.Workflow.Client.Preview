import type { ManifestBase } from "@umbraco-cms/backoffice/extension-api";
import { WORKFLOW_EXPANSION_TYPE_ALIAS } from "./constants.js";
import { PropertyEditorSettingsProperty } from "@umbraco-cms/backoffice/property-editor";
import { UmbPropertyTypeValidationModel } from "@umbraco-cms/backoffice/content-type";
import { WorkflowState } from "@umbraco-workflow/context";

export interface ManifestEntityWorkflowExpansion extends ManifestBase {
  type: typeof WORKFLOW_EXPANSION_TYPE_ALIAS;
  entityType: string;
  meta: MetaWorkflowEntityWorkflowExpansion;
}

export interface MetaWorkflowEntityWorkflowExpansion {
  properties: MetaWorkflowEntityWorkflowExpansionProperties;
}

export type MetaWorkflowEntityWorkflowExpansionProperties = Array<
  PropertyEditorSettingsProperty & {
    validation?: UmbPropertyTypeValidationModel;
    core?: boolean;
    include?: (args: {
      state?: WorkflowState;
      varies?: boolean;
    }) => boolean | undefined;
  }
>;

declare global {
  interface UmbExtensionManifestMap {
    workflowExpansion: ManifestEntityWorkflowExpansion;
  }
}
