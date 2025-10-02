import type { ManifestApi, UmbApi } from "@umbraco-cms/backoffice/extension-api";
import type { Observable } from "@umbraco-cms/backoffice/observable-api";
import type { ScaffoldArgsModel } from "../context/entities.js";

export interface WorkflowEntityWorkflowInitializer extends UmbApi {
    initializerArgs: Observable<ScaffoldArgsModel | undefined>;
    getIsPublished: () => boolean;
    getIsNew: () => boolean;
}

export interface ManifestEntityWorkflowInitializer extends ManifestApi<WorkflowEntityWorkflowInitializer> {
  type: "workflowInitializer";
  entityType: string;
}

declare global {
  interface UmbExtensionManifestMap {
    workflowInitializer: ManifestEntityWorkflowInitializer;
  }
}
