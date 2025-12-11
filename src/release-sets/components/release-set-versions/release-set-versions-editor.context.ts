import { UmbContextBase } from "@umbraco-cms/backoffice/class-api";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import {
  appendToFrozenArray,
  UmbObjectState,
} from "@umbraco-cms/backoffice/observable-api";
import { tryExecute } from "@umbraco-cms/backoffice/resources";
import { formatDate } from "@umbraco-workflow/core";
import {
  VersionsService,
  type ContentVariationModel,
  type ReleaseSetItemResponseModel,
  type ReleaseSetVersionResponseModel,
} from "@umbraco-workflow/generated";
import { WORKFLOW_RELEASESET_VERSIONS_EDITOR_CONTEXT } from "./release-set-versions-editor.context-token.js";

export class WorkflowReleaseSetVersionsEditorContext extends UmbContextBase {
  #current = new UmbObjectState<ReleaseSetItemResponseModel | undefined>(
    undefined
  );
  current = this.#current.asObservable();

  items = this.#current.asObservablePart((x) => x?.items ?? []);

  #variation = new UmbObjectState<ContentVariationModel | undefined>(undefined);
  variation = this.#variation.asObservable();

  defaultReleaseDate?: string;

  constructor(host: UmbControllerHost) {
    super(host, WORKFLOW_RELEASESET_VERSIONS_EDITOR_CONTEXT.toString());
  }

  async setValue(item?: ReleaseSetItemResponseModel) {
    if (!item) return;

    const { data } = await tryExecute(
      this,
      VersionsService.getVersionVariationsById({ path: { id: item.unique } })
    );

    this.#current.setValue(item);
    this.#variation.setValue(data);
  }

  getItems() {
    return this.getCurrent()?.items ?? [];
  }

  getCurrent() {
    return this.#current.getValue();
  }

  getUnique() {
    return this.getCurrent()?.unique;
  }

  removeVersion(unique?: string) {
    if (!unique) return;

    this.#current.update({
      items: this.getItems().filter((x) => x.unique !== unique),
    });
  }

  addVersion(version: ReleaseSetVersionResponseModel) {
    this.#current.update({
      items: appendToFrozenArray(this.getItems(), version),
    });
  }

  updateVersion(
    version: Partial<ReleaseSetVersionResponseModel> & {
      unique?: string;
    }
  ) {
    if (!version.unique) return;
    const currentItems = this.getItems();
    const existing = currentItems.find((x) => x.unique === version.unique);
    if (!existing) return;

    const items = appendToFrozenArray(
      currentItems,
      { ...existing, ...version },
      (x) => x.unique === version.unique
    );

    this.#current.update({
      items,
      status: items.some((x) => x.status === "Draft")
        ? "Draft"
        : "ReadyToPublish",
    });
  }

  setDefaultReleaseDate(date?: Date) {
    this.defaultReleaseDate = formatDate(date?.toString());
  }
}

export { WorkflowReleaseSetVersionsEditorContext as api };
