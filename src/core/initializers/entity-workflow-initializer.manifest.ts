import type {
  ManifestApi,
  UmbApi,
} from "@umbraco-cms/backoffice/extension-api";
import type { Observable } from "@umbraco-cms/backoffice/observable-api";
import type { ScaffoldArgsModel } from "../context/entities.js";
import { WORKFLOW_INITIALIZER_TYPE_ALIAS } from "./constants.js";

export interface WorkflowEntityWorkflowInitializer extends UmbApi {
    initializerArgs: Observable<ScaffoldArgsModel | undefined>;
    getIsPublished: () => boolean;
    getIsNew: () => boolean;
}

export interface ManifestEntityWorkflowInitializer
  extends ManifestApi<WorkflowEntityWorkflowInitializer> {
  type: typeof WORKFLOW_INITIALIZER_TYPE_ALIAS;
  entityType: string;
}

declare global {
  interface UmbExtensionManifestMap {
    workflowInitializer: ManifestEntityWorkflowInitializer;
  }
}
