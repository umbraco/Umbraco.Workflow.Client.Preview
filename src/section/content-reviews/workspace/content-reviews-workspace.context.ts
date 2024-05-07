import {
  UmbSubmittableWorkspaceContextBase,
  type UmbRoutableWorkspaceContext,
  type UmbSubmittableWorkspaceContext,
} from "@umbraco-cms/backoffice/workspace";

import {
  UmbArrayState,
  UmbObjectState,
  appendToFrozenArray,
} from "@umbraco-cms/backoffice/observable-api";
import type { UmbControllerHostElement } from "@umbraco-cms/backoffice/controller-api";
import { WorkflowContentReviewsRepository } from "../repository/content-reviews.repository.js";
import {
  type ContentReviewConfigItem,
  type ContentReviewItem,
  type ContentReviewType,
} from "../types.js";
import {
  WORKFLOW_CONTENTREVIEWS_ENTITY_TYPE,
  WorkflowContentReviewsEditorElement,
} from "../index.js";
import { WORKFLOW_CONTENTREVIEWS_WORKSPACE_ALIAS } from "./manifests.js";
import type {
  ContentReviewsConfigModel,
  ContentReviewsDetailedConfigModel,
  ContentReviewsSettingsModel,
  LanguageModel,
  SettingsPropertyDisplayModel,
} from "@umbraco-workflow/generated";

export class WorkflowContentReviewsWorkspaceContext
  extends UmbSubmittableWorkspaceContextBase<ContentReviewsConfigModel>
  implements UmbSubmittableWorkspaceContext, UmbRoutableWorkspaceContext
{
  public readonly IS_CONTENT_REVIEWS_WORKSPACE_CONTEXT = true;
  public readonly repository = new WorkflowContentReviewsRepository(this);

  readonly unique;

  #data = new UmbObjectState<ContentReviewsConfigModel | undefined>(undefined);

  #settings = new UmbObjectState<ContentReviewsSettingsModel | undefined>(
    undefined
  );
  settings = this.#settings.asObservable();

  #languages = new UmbArrayState<LanguageModel>([], (x) => x.isoCode);
  languages = this.#languages.asObservable();

  deletedReviews: Array<number> = [];

  constructor(host: UmbControllerHostElement) {
    super(host, WORKFLOW_CONTENTREVIEWS_WORKSPACE_ALIAS);

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
    if (data) {
      this.#data.setValue(data);
      this.#settings.setValue(data.settings);
      this.#languages.setValue(data.availableLanguages ?? []);
    }
  }

  getData() {
    return this.#data.getValue();
  }

  getEntityType() {
    return WORKFLOW_CONTENTREVIEWS_ENTITY_TYPE;
  }

  getUnique() {
    return "";
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
    alias: "contentItemReviews" | "documentTypeReviews"
  ) {
    const existing = this.#settings.getValue()?.[alias];
    if (!existing) throw new Error("property is missing");

    this.#updateSettingsValue(alias, {
      ...existing,
      ...{ value },
    });
  }

  #updateSettingsValue(
    alias: string,
    updatedProperty:
      | SettingsPropertyDisplayModel
      | Array<SettingsPropertyDisplayModel>
  ) {
    this.#settings.update({ [alias]: updatedProperty });
    // TODO => does the above require the below?
    this.#data.update({ settings: this.#settings.getValue() });
  }

  // TODO => fix model to exclude last six properties - these are server-side concerns
  getSyncModel(
    r: ContentReviewConfigItem,
    type: ContentReviewType,
    key?: string
  ): ContentReviewsDetailedConfigModel {
    if (!key) throw new Error("key is missing");

    return {
      id: r.id!,
      documentKey: type === "document" ? key : undefined,
      documentTypeKey: type === "documentType" ? key : undefined,
      variant: r.variant!,
      excluded: r.excluded ? true : false,
      groups:
        r.groups?.map((g) => ({
          key: g.key,
          groupId: g.groupId,
          name: g.name,
          users: g.users,
        })) ?? [],
      period: r.period!,
      externalReviewers: r.externalReviewers,

      name: "",
      variantName: "",
      isDefaultVariant: false,
      expired: false,
      groupIds: r.groups?.map((g) => g.groupId).join(",") ?? "",
      inherited: false,
      inheritedFrom: "",
      inheritedType: "",
      responsibleUsers: [],
      icon: "",
    };
  }

  async saveAndRegenerate(force: boolean, relativeTo: 0 | 1) {
    await this.submit(true, force, relativeTo);
  }

  async submit(regenerate = false, force = false, relativeTo: 0 | 1 = 0) {
    const data = this.#data.getValue();
    if (!data) return;

    const config: Array<ContentReviewsDetailedConfigModel> = [];

    (<Array<ContentReviewItem>>data.settings.contentItemReviews.value).forEach(
      (x: ContentReviewItem) => {
        x.configItems.forEach((r) =>
          config.push(this.getSyncModel(r, "document", x.documentKey))
        );
      }
    );

    (<Array<ContentReviewItem>>data.settings.documentTypeReviews.value).forEach(
      (x: ContentReviewItem) => {
        x.configItems.forEach((r) =>
          config.push(this.getSyncModel(r, "documentType", x.documentTypeKey))
        );
      }
    );

    await this.repository.save({
      config,
      settings: { ...data.settings, force, relativeTo },
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
