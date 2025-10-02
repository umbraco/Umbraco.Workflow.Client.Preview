import {
  UmbSubmittableWorkspaceContextBase,
  UmbWorkspaceIsNewRedirectController,
} from "@umbraco-cms/backoffice/workspace";
import {
  appendToFrozenArray,
  UmbClassState,
  UmbObjectState,
} from "@umbraco-cms/backoffice/observable-api";
import type { UmbControllerHostElement } from "@umbraco-cms/backoffice/controller-api";
import { UmbDocumentTypeDetailRepository } from "@umbraco-cms/backoffice/document-type";
import { UmbContentTypeStructureManager } from "@umbraco-cms/backoffice/content-type";
import { type UmbPropertyValueData } from "@umbraco-cms/backoffice/property";
import { UmbVariantId } from "@umbraco-cms/backoffice/variant";
import { UmbDocumentDetailRepository } from "@umbraco-cms/backoffice/document";
import { WorkflowAlternateVersionDetailRepository } from "../../repository/detail/alternate-version-detail.repository.js";
import {
  ALTERNATEVERSION_ENTITY_TYPE,
  WORKFLOW_ALTERNATEVERSION_WORKSPACE_ALIAS,
} from "../../constants.js";
import { type AlternateVersionDetailResponseModelReadable } from "@umbraco-workflow/generated";
import type { WorkflowApprovableWorkspaceContext } from "@umbraco-workflow/context";
import { UmbEntityUpdatedEvent } from "@umbraco-cms/backoffice/entity-action";
import { UmbId } from "@umbraco-cms/backoffice/id";
import { UMB_ACTION_EVENT_CONTEXT } from "@umbraco-cms/backoffice/action";

export class WorkflowAlternateVersionWorkspaceContext
  extends UmbSubmittableWorkspaceContextBase<AlternateVersionDetailResponseModelReadable>
  implements WorkflowApprovableWorkspaceContext
{
  public readonly IS_ALTERNATEVERSION_WORKSPACE_CONTEXT = true;
  public readonly IS_APPROVABLE_WORKSPACE_CONTEXT = true;

  #eventContext?: typeof UMB_ACTION_EVENT_CONTEXT.TYPE;

  #detailRepository = new WorkflowAlternateVersionDetailRepository(this);
  #documentDetailRepository = new UmbDocumentDetailRepository(this);

  readonly structure = new UmbContentTypeStructureManager(
    this,
    new UmbDocumentTypeDetailRepository(this)
  );

  data = new UmbObjectState<
    AlternateVersionDetailResponseModelReadable | undefined
  >(undefined);

  readonly unique = this.data.asObservablePart(
    (data) => data?.unique as string
  );

  readonly versionName = this.data.asObservablePart(
    (data) => data?.versionName
  );

  readonly documentName = this.data.asObservablePart(
    (data) => data?.documentName
  );

  readonly values = this.data.asObservablePart((data) => data?.values ?? []);

  #currentVariant = new UmbClassState<UmbVariantId | undefined>(undefined);
  readonly currentVariant = this.#currentVariant.asObservable();

  // Discriminator to identify events from this workspace context
  protected readonly _workspaceEventUnique = UmbId.new();

  constructor(host: UmbControllerHostElement) {
    super(host, WORKFLOW_ALTERNATEVERSION_WORKSPACE_ALIAS);

    this.consumeContext(UMB_ACTION_EVENT_CONTEXT, (context) => {
      this.#eventContext = context;
    });

    this.routes.setRoutes([
      {
        path: "edit/:id",
        component: async () =>
          await import("../alternate-version-workspace-editor.element.js"),
        setup: async (_component, info) =>
          await this.load(info.match.params.id),
      },
      {
        path: "create/:parentId/:variant/:segment",
        component: async () =>
          await import("../alternate-version-workspace-editor.element.js"),
        setup: async (_component, info) => {
          await this.create(
            info.match.params.parentId,
            info.match.params.variant,
            info.match.params.segment
          );

          new UmbWorkspaceIsNewRedirectController(
            this,
            this,
            this.getHostElement().shadowRoot!.querySelector("umb-router-slot")!
          );
        },
      },
      {
        path: `**`,
        component: async () =>
          (await import("@umbraco-cms/backoffice/router"))
            .UmbRouteNotFoundElement,
      },
    ]);
  }

  async #load(args: {
    unique?: string;
    parentUnique?: string;
    variant?: string | null;
    segment?: string | null;
  }) {
    const { data } = args.unique
      ? await this.#detailRepository.requestByUnique(args.unique)
      : await this.#detailRepository.createScaffold(args);

    if (!data) return;

    this.#currentVariant.setValue(new UmbVariantId(data.variant, data.segment));

    this.setIsNew(!args.unique);
    this.data.update(data);

    await this.getStructure(
      data.parentUnique,
      data.variant ?? null,
      data.segment ?? null,
      args.unique === undefined
    );

    return data;
  }

  async load(unique: string) {
    return await this.#load({ unique });
  }

  async create(parentUnique: string, variant?: string, segment?: string) {
    return await this.#load({
      parentUnique,
      variant: variant === "null" ? null : variant,
      segment: segment === "null" ? null : segment,
    });
  }

  async getStructure(
    parentUnique: string,
    variant: string | null,
    segment: string | null,
    setValues = true
  ) {
    const { data } = await this.#documentDetailRepository.requestByUnique(
      parentUnique
    );

    await this.structure.loadType(data?.documentType.unique ?? "");

    if (!setValues) return;

    const variantFilter = (x) =>
      (x.culture === variant || x.culture === null) &&
      (x.segment === segment || x.segment === null);

    const validValues = data?.values.filter(variantFilter) ?? [];
    const documentName = data?.variants.filter(variantFilter)?.at(0)?.name;

    this.data.update({
      values: validValues,
      documentName,
    });
  }

  public submit() {
    return this.#handleSubmit();
  }

  public override requestSubmit(): Promise<void> {
    return this.#handleSubmit();
  }

  async #handleSubmit() {
    const model = this.getData();
    if (!model) return;

    this.getIsNew()
      ? await this.#detailRepository.create(model, null)
      : await this.#detailRepository.save(model);

    this.setIsNew(false);

    this.#eventContext?.dispatchEvent(
      new UmbEntityUpdatedEvent({
        unique: model.unique + "_" + this.getParentUnique(),
        entityType: this.getEntityType(),
        eventUnique: this._workspaceEventUnique,
      })
    );
  }

  async delete() {
    const unique = this.getUnique();
    if (!unique) return;

    const { error } = await this.#detailRepository.delete(unique);
    return error === undefined;
  }

  getData() {
    return this.data.getValue();
  }

  getName() {
    return this.data.getValue()?.documentName ?? "";
  }

  getEntityType() {
    return ALTERNATEVERSION_ENTITY_TYPE;
  }

  getUnique() {
    return this.getData()?.unique;
  }

  getParentUnique() {
    return this.getData()?.parentUnique;
  }

  getCurrentVariant() {
    return this.#currentVariant.getValue();
  }

  setName(documentName: string) {
    this.data.update({ documentName });
  }

  setVersionName(versionName: string) {
    this.data.update({ versionName });
  }

  setValues(values: Array<UmbPropertyValueData>) {
    this.data.update({ values });
  }

  setValue<ValueType = unknown>(
    alias: string,
    value: ValueType,
    propertyVariation: UmbVariantId
  ) {
    const values = [...(this.getData()?.values ?? [])];
    const toUpdate = values.find((x) => x.alias === alias) ?? {
      alias,
      ...propertyVariation,
    };

    this.data.update({
      values: appendToFrozenArray(
        values,
        { ...toUpdate, ...{ value } },
        (x) => x.alias === alias
      ),
    });
  }

  destroy() {
    this.#detailRepository.destroy();
    this.#documentDetailRepository.destroy();
    super.destroy();
  }
}

export { WorkflowAlternateVersionWorkspaceContext as api };
