import {
  UmbSubmittableWorkspaceContextBase,
  type UmbRoutableWorkspaceContext,
  type UmbSubmittableWorkspaceContext,
} from "@umbraco-cms/backoffice/workspace";
import {
  UmbObjectState,
  UmbStringState,
  appendToFrozenArray,
} from "@umbraco-cms/backoffice/observable-api";
import type { UmbControllerHostElement } from "@umbraco-cms/backoffice/controller-api";
import { WorkflowContentReviewsRepository } from "../repository/content-reviews.repository.js";
import {
  type ContentReviewConfigItem,
  type ContentReviewItem,
  type ContentReviewType,
} from "../entities.js";
import { WORKFLOW_CONTENTREVIEWS_WORKSPACE_CONTEXT } from "../index.js";
import {
  WORKFLOW_CONTENT_REVIEW_ENTITY_TYPE,
  WORKFLOW_CONTENTREVIEWS_WORKSPACE_ALIAS,
} from "../constants.js";
import { WorkflowContentReviewsEditorElement } from "./content-reviews-editor.element.js";
import type {
  ContentReviewsConfigModel,
  ContentReviewsDetailedConfigModel,
  ContentReviewsSettingsModel,
  ContentTypePropertyModel,
  PropertyDisplayModel,
  SettingsPropertyDisplayModel,
} from "@umbraco-workflow/generated";

type SectionAlias = "contentItemReviews" | "documentTypeReviews";

export class WorkflowContentReviewsWorkspaceContext
  extends UmbSubmittableWorkspaceContextBase<ContentReviewsConfigModel>
  implements UmbSubmittableWorkspaceContext, UmbRoutableWorkspaceContext
{
  public readonly IS_CONTENT_REVIEWS_WORKSPACE_CONTEXT = true;
  public readonly repository = new WorkflowContentReviewsRepository(this);

  #unique = new UmbStringState(WORKFLOW_CONTENT_REVIEW_ENTITY_TYPE.toString());

  #settings = new UmbObjectState<ContentReviewsSettingsModel | undefined>(
    undefined
  );

  settings = this.#settings.asObservable();
  unique = this.#unique.asObservable();

  deletedReviews: Array<number> = [];
  contentTypes: Array<ContentTypePropertyModel> = [];

  constructor(host: UmbControllerHostElement) {
    super(host, WORKFLOW_CONTENTREVIEWS_WORKSPACE_ALIAS);
    this.provideContext(WORKFLOW_CONTENTREVIEWS_WORKSPACE_CONTEXT, this);

    this.routes.setRoutes([
      {
        path: "",
        component: WorkflowContentReviewsEditorElement,
        setup: () => {
          this.load();
        },
      },
    ]);
  }

  async load() {
    const { data } = await this.repository.read();
    if (!data) return;

    this.#settings.setValue(data.settings);
    this.contentTypes = data.contentTypes;
  }

  getData() {
    return undefined;
  }

  getEntityType() {
    return WORKFLOW_CONTENT_REVIEW_ENTITY_TYPE;
  }

  getUnique() {
    return this.#unique.getValue();
  }

  setPropertyValue<ValueType>(value: ValueType, alias: string) {
    const properties = this.#settings.getValue()?.properties;
    if (!properties) throw new Error("properties are missing");

    const property = {
      ...properties!.find((p) => p.alias === alias)!,
      ...{ value },
    };

    this.#updateSettingsValue(
      "properties",
      appendToFrozenArray(properties, property, (x) => x.alias)
    );
  }

  setContentReviewValue<ValueType>(
    value: ValueType,
    alias: SectionAlias
  ) {
    const existing = this.#settings.getValue()?.[alias];
    if (!existing) throw new Error("property is missing");

    this.#updateSettingsValue(alias, {
      ...existing,
      ...{ value },
    });
  }

  #updateSettingsValue(
    alias: keyof ContentReviewsSettingsModel,
    updatedProperty: PropertyDisplayModel | Array<SettingsPropertyDisplayModel>
  ) {
    this.#settings.update({ [alias]: updatedProperty });
  }

  getSyncModel(
    r: ContentReviewConfigItem,
    type: ContentReviewType,
    key?: string
  ): ContentReviewsDetailedConfigModel {
    if (!key) throw new Error("key is missing");

    return {
      id: r.id!,
      documentKey: type === "document" ? key : undefined,
      documentTypeKey: type === "document-type" ? key : undefined,
      variant: r.variant!,
      excluded: r.excluded ? true : false,
      period: r.period!,
      externalReviewers: r.externalReviewers,
      name: "",
      variantName: "",
      isDefaultVariant: false,
      expired: false,
      groupIds: r.groups?.map((g) => g.unique).join(",") ?? "",
    };
  }

  async saveAndRegenerate(force: boolean, relativeTo: number) {
    await this.submit(true, force, relativeTo);
  }

  async submit(regenerate = false, force = false, relativeTo = 0) {
    const settings = this.#settings.getValue();
    if (!settings) return;

    const config: Array<ContentReviewsDetailedConfigModel> = [];

    (<Array<ContentReviewItem>>settings.contentItemReviews.value).forEach(
      (x: ContentReviewItem) => {
        x.configItems.forEach((r) =>
          config.push(this.getSyncModel(r, "document-type", x.documentKey))
        );
      }
    );

    (<Array<ContentReviewItem>>settings.documentTypeReviews.value).forEach(
      (x: ContentReviewItem) => {
        x.configItems.forEach((r) =>
          config.push(this.getSyncModel(r, "document-type", x.documentTypeKey))
        );
      }
    );

    await this.repository.save({
      config,
      settings: { ...settings, force, relativeTo },
      regenerate,
      delete: this.deletedReviews,
    });
  }

  deleteReview(item: ContentReviewItem) {
    item.configItems.forEach((c) => {
      // if no id, item has not been saved so no need to mark for deletion
      if (!c.id) return;
      this.deletedReviews.push(c.id);
    });
  }

  destroy(): void {
    this.repository.destroy();
    super.destroy();
  }
}

export { WorkflowContentReviewsWorkspaceContext as api };
