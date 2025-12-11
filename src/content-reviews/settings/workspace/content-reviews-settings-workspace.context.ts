import {
  type UmbRoutableWorkspaceContext,
  type UmbSubmittableWorkspaceContext,
} from "@umbraco-cms/backoffice/workspace";
import { UmbObjectState } from "@umbraco-cms/backoffice/observable-api";
import type { UmbControllerHostElement } from "@umbraco-cms/backoffice/controller-api";
import { WorkflowContentReviewsRepository } from "../repository/content-reviews.repository.js";
import {
  type ContentReviewConfigItem,
  type ContentReviewItem,
  type ContentReviewType,
} from "../../entities.js";
import type {
  ContentReviewsConfigModel,
  ContentReviewsDetailedConfigModel,
  ContentReviewsSaveSettingsModel,
  ContentReviewsSettingsModel,
  ContentTypePropertyModel,
  SettingsPropertyDisplayModel,
} from "@umbraco-workflow/generated";
import { UMB_DOCUMENT_ENTITY_TYPE } from "@umbraco-cms/backoffice/document";
import { UMB_DOCUMENT_TYPE_ENTITY_TYPE } from "@umbraco-cms/backoffice/document-type";
import { WORKFLOW_CONTENTREVIEWS_SETTINGS_WORKSPACE_CONTEXT } from "./content-reviews-settings-workspace.context-token.js";
import {
  WORKFLOW_CONTENTREVIEWS_SETTINGS_ENTITY_TYPE,
  WORKFLOW_CONTENTREVIEWS_SETTINGS_WORKSPACE_ALIAS,
} from "../constants.js";
import { WorkflowSettingsWorkspaceContextBase } from "@umbraco-workflow/context";

type SectionAlias = "contentItemReviews" | "documentTypeReviews";

export class WorkflowContentReviewsSettingsWorkspaceContext
  extends WorkflowSettingsWorkspaceContextBase<
    ContentReviewsConfigModel,
    ContentReviewsSaveSettingsModel
  >
  implements UmbSubmittableWorkspaceContext, UmbRoutableWorkspaceContext
{
  #data = new UmbObjectState<ContentReviewsSettingsModel | undefined>(
    undefined
  );

  settings = this.#data.asObservable();

  deletedReviews: Array<number> = [];
  contentTypes: Array<ContentTypePropertyModel> = [];

  constructor(host: UmbControllerHostElement, args: { title: string }) {
    super(host, {
      ...args,
      workspaceAlias: WORKFLOW_CONTENTREVIEWS_SETTINGS_WORKSPACE_ALIAS,
      entityTypeAlias: WORKFLOW_CONTENTREVIEWS_SETTINGS_ENTITY_TYPE,
      contextToken: WORKFLOW_CONTENTREVIEWS_SETTINGS_WORKSPACE_CONTEXT,
      repositoryCtor: WorkflowContentReviewsRepository,
    });
  }

  getProperties(): Array<SettingsPropertyDisplayModel> {
    return this.#data.getValue()?.properties ?? [];
  }

  setProperties(properties?: Array<SettingsPropertyDisplayModel>) {
    this.#data.update({ properties });
  }

  async load() {
    if (!this.repository) return;

    const { data } = await this.repository.read();
    if (!data) return;

    this.#data.setValue(data.settings);
    this.contentTypes = data.contentTypes;
  }

  setContentReviewValue<ValueType>(value: ValueType, alias: SectionAlias) {
    const existing = this.#data.getValue()?.[alias];
    if (!existing) throw new Error("property is missing");

    this.#data.update({
      [alias]: {
        ...existing,
        ...{ value },
      },
    });
  }

  getSyncModel(
    r: ContentReviewConfigItem,
    type: ContentReviewType,
    key?: string
  ): ContentReviewsDetailedConfigModel {
    if (!key) throw new Error("key is missing");

    return {
      id: r.id!,
      documentKey: type === UMB_DOCUMENT_ENTITY_TYPE ? key : undefined,
      documentTypeKey: type === UMB_DOCUMENT_TYPE_ENTITY_TYPE ? key : undefined,
      culture: r.culture!,
      excluded: r.excluded ? true : false,
      period: r.period!,
      externalReviewers: r.externalReviewers,
      name: "",
      cultureName: "",
      isDefaultCulture: false,
      expired: false,
      groupIds: r.groups?.map((g) => g.unique).join(",") ?? "",
    };
  }

  async saveAndRegenerate(force: boolean, relativeTo: number) {
    await this.submit(true, force, relativeTo);
  }

  async submit(regenerate = false, force = false, relativeTo = 0) {
    const settings = this.#data.getValue();
    if (!settings) return;

    const config: Array<ContentReviewsDetailedConfigModel> = [];

    (<Array<ContentReviewItem>>settings.contentItemReviews.value).forEach(
      (x: ContentReviewItem) => {
        x.configItems.forEach((r) =>
          config.push(
            this.getSyncModel(r, UMB_DOCUMENT_ENTITY_TYPE, x.documentKey)
          )
        );
      }
    );

    (<Array<ContentReviewItem>>settings.documentTypeReviews.value).forEach(
      (x: ContentReviewItem) => {
        x.configItems.forEach((r) =>
          config.push(
            this.getSyncModel(
              r,
              UMB_DOCUMENT_TYPE_ENTITY_TYPE,
              x.documentTypeKey
            )
          )
        );
      }
    );

    await this.repository?.save({
      config,
      settings: { ...settings, force, relativeTo: +relativeTo },
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
}

export { WorkflowContentReviewsSettingsWorkspaceContext as api };
