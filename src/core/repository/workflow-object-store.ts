import { UmbContextBase } from "@umbraco-cms/backoffice/class-api";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import type { ManifestApi } from "@umbraco-cms/backoffice/extension-api";
import type { UmbObjectState } from "@umbraco-cms/backoffice/observable-api";
import { WORKFLOW_OBJECT_STORE_TYPE_ALIAS } from "./constants.js";

export interface ManifestWorkflowObjectStore
  extends ManifestApi<WorkflowObjectStore> {
  type: typeof WORKFLOW_OBJECT_STORE_TYPE_ALIAS;
}

export abstract class WorkflowObjectStore<
  StoreItemType = any
> extends UmbContextBase {
  #data?: UmbObjectState<StoreItemType>;

  readonly data = this.#data?.asObservable();

  constructor(host: UmbControllerHost, storeAlias: string) {
    super(host, storeAlias);
  }

  get() {
    return this.#data?.getValue();
  }

  update(data: StoreItemType) {
    this.#data?.setValue(data);
  }
}

declare global {
  interface UmbExtensionManifestMap {
    workflowObjectStore: ManifestWorkflowObjectStore;
  }
}
