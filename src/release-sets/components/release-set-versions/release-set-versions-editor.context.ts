import { UmbContextBase } from "@umbraco-cms/backoffice/class-api";
import { UmbContextToken } from "@umbraco-cms/backoffice/context-api";
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
  type ReleaseSetItemResponseModelReadable,
  type ReleaseSetVersionResponseModelReadable,
} from "@umbraco-workflow/generated";

export class WorkflowReleaseSetVersionsEditorContext extends UmbContextBase {
  #current = new UmbObjectState<
    ReleaseSetItemResponseModelReadable | undefined
  >(undefined);
  current = this.#current.asObservable();

  items = this.#current.asObservablePart((x) => x?.items ?? []);

  #variation = new UmbObjectState<ContentVariationModel | undefined>(undefined);
  variation = this.#variation.asObservable();

  defaultReleaseDate?: string;

  constructor(host: UmbControllerHost) {
    super(host, WORKFLOW_RELEASESET_ITEM_EDITOR_CONTEXT.toString());
  }

  async setValue(item?: ReleaseSetItemResponseModelReadable) {
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

  addVersion(version: ReleaseSetVersionResponseModelReadable) {
    this.#current.update({
      items: appendToFrozenArray(this.getItems(), version),
    });
  }

  updateVersion(
    version: Partial<ReleaseSetVersionResponseModelReadable> & {
      unique?: string;
    }
  ) {
    if (!version.unique) return;
    const existing = this.getItems().find((x) => x.unique === version.unique);
    if (!existing) return;

    this.#current.update({
      items: appendToFrozenArray(
        this.getItems(),
        { ...existing, ...version },
        (x) => x.unique === version.unique
      ),
    });
  }

  setDefaultReleaseDate(date?: Date) {
    this.defaultReleaseDate = formatDate(date?.toString());
  }
}

export { WorkflowReleaseSetVersionsEditorContext as api };

export const WORKFLOW_RELEASESET_ITEM_EDITOR_CONTEXT =
  new UmbContextToken<WorkflowReleaseSetVersionsEditorContext>(
    "WorkflowReleaseSetItemEditorContext"
  );
