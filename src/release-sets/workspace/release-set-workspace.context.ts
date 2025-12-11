import { UmbSubmittableWorkspaceContextBase } from "@umbraco-cms/backoffice/workspace";
import {
  appendToFrozenArray,
  partialUpdateFrozenArray,
  UmbObjectState,
} from "@umbraco-cms/backoffice/observable-api";
import type { UmbControllerHostElement } from "@umbraco-cms/backoffice/controller-api";
import { UMB_CURRENT_USER_CONTEXT } from "@umbraco-cms/backoffice/current-user";
import { firstValueFrom } from "@umbraco-cms/backoffice/external/rxjs";
import { UmbId } from "@umbraco-cms/backoffice/id";
import { WorkflowReleaseSetDetailRepository } from "../repository/detail/release-set-detail.repository.js";
import {
  RELEASESET_ENTITY_TYPE,
  RELEASESET_VERSION_ENTITY_TYPE,
  WORKFLOW_RELEASESET_WORKSPACE_ALIAS,
} from "../constants.js";
import {
  ReleaseSetStatusModel,
  type ReleaseSetDetailResponseModel,
  type ReleaseSetTaskResponseModel,
  ReleaseSetItemResponseModel,
} from "@umbraco-workflow/generated";
import { type StatusModel } from "@umbraco-workflow/core";
import { UMB_ACTION_EVENT_CONTEXT } from "@umbraco-cms/backoffice/action";
import { UmbEntityUpdatedEvent } from "@umbraco-cms/backoffice/entity-action";
import { WorkflowAlternateVersionDetailRepository } from "@umbraco-workflow/alternate-versions";
import {
  ObservableArrayGetterFnType,
  ObservableArraySetterFnType,
} from "../entities.js";

export class WorkflowReleaseSetWorkspaceContext extends UmbSubmittableWorkspaceContextBase<ReleaseSetDetailResponseModel> {
  public readonly IS_RELEASESET_WORKSPACE_CONTEXT = true;

  #detailRepository = new WorkflowReleaseSetDetailRepository(this);
  #versionRepository = new WorkflowAlternateVersionDetailRepository(this);

  #data = new UmbObjectState<ReleaseSetDetailResponseModel | undefined>(
    undefined
  );

  data = this.#data.asObservable();
  icon = this.#data.asObservablePart((x) => x?.icon ?? "icon-document");
  unique = this.#data.asObservablePart((x) => x?.unique);
  description = this.#data.asObservablePart((x) => x?.description);
  name = this.#data.asObservablePart((x) => x?.name);
  owner = this.#data.asObservablePart((x) => x?.owner);
  items = this.#data.asObservablePart((x) => x?.items);
  tasks = this.#data.asObservablePart((x) => x?.tasks);
  releaseDate = this.#data.asObservablePart((x) => x?.releaseDate);

  #currentUserUnique?: string;

  constructor(host: UmbControllerHostElement) {
    super(host, WORKFLOW_RELEASESET_WORKSPACE_ALIAS);

    this.routes.setRoutes([
      {
        path: "edit/:id",
        component: async () =>
          await import("./release-set-workspace-editor.element.js"),
        setup: async (_component, info) =>
          await this.load(info.match.params.id),
      },
      {
        path: "create",
        component: async () =>
          await import("./release-set-workspace-editor.element.js"),
        setup: async () => await this.create(),
      },
      {
        path: `**`,
        component: async () =>
          (await import("@umbraco-cms/backoffice/router"))
            .UmbRouteNotFoundElement,
      },
    ]);

    this.consumeContext(UMB_ACTION_EVENT_CONTEXT, (context) => {
      context?.removeEventListener(
        UmbEntityUpdatedEvent.TYPE,
        this.#onVersionUpdatedEvent as unknown as EventListener
      );

      context?.addEventListener(
        UmbEntityUpdatedEvent.TYPE,
        this.#onVersionUpdatedEvent as unknown as EventListener
      );
    });

    this.consumeContext(UMB_CURRENT_USER_CONTEXT, (context) => {
      this.observe(context?.unique, (unique) => {
        this.#currentUserUnique = unique;
      });
    });
  }

  async load(unique: string) {
    const { data } = await this.#detailRepository.requestByUnique(unique);
    if (!data) return;

    this.setIsNew(false);
    this.#data.setValue(data);
  }

  async create() {
    const { data } = await this.#detailRepository.createScaffold();
    if (!data) return;

    this.setIsNew(true);
    this.#data.setValue(data);
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
  }

  async delete() {
    const unique = this.getUnique();
    if (!unique) return;

    const { error } = await this.#detailRepository.delete(unique);
    return error === undefined;
  }

  getData() {
    return this.#data.getValue();
  }

  getEntityType() {
    return RELEASESET_ENTITY_TYPE;
  }

  getUnique() {
    return this.getData()?.unique;
  }

  update(args: Partial<ReleaseSetDetailResponseModel>) {
    this.#data.update(args);
  }

  /**
   * When completeAllItems is true, items and tasks have their status set to READY_TO_PUBLISH
   * and CLOSED respectively. Tasks are set to CLOSED only if ACTIVE (COMPLETED tasks are not modified)
   * @param status
   * @param completeAllItems
   * @returns
   */
  updateSetStatus(status: ReleaseSetStatusModel, completeAllItems = false) {
    this.#data.update({ status });

    if (!completeAllItems) return;

    const data = this.getData();

    this.#data.update({
      tasks: data?.tasks.map((task) => ({
        ...task,
        ...{
          status: task.status === "Active" ? "Closed" : task.status,
        },
      })),
      items: data?.items.map((item) => ({
        ...item,
        ...{ status: "ReadyToPublish" },
      })),
      status,
    });
  }

  addTask(task: ReleaseSetTaskResponseModel) {
    this.#data.update({
      tasks: appendToFrozenArray(this.getData()?.tasks ?? [], {
        ...task,
        ...{
          unique: UmbId.new(),
          parent: this.getUnique(),
          createdBy: {
            unique: this.#currentUserUnique!,
          },
          status: "Active",
        },
      }),
    });
  }

  updateTask(task: ReleaseSetTaskResponseModel) {
    this.#data.update({
      tasks: partialUpdateFrozenArray(
        this.getData()?.tasks ?? [],
        task,
        (x) => x.unique === task.unique
      ),
    });
  }

  removeTasks(uniques: Array<string>) {
    const tasks =
      this.getData()?.tasks.filter(
        (x) => !uniques.some((u) => u === x.unique)
      ) ?? [];

    this.#data.update({
      tasks,
    });
  }

  addItem(item: ReleaseSetItemResponseModel) {
    this.#data.update({
      items: appendToFrozenArray(this.getData()?.items ?? [], item),
    });
  }

  updateItem(item: ReleaseSetItemResponseModel) {
    this.#data.update({
      items: partialUpdateFrozenArray(
        this.getData()?.items ?? [],
        item,
        (x) => x.unique === item.unique
      ),
    });
  }

  removeItems(uniques: Array<string>) {
    const items =
      this.getData()?.items.filter(
        (x) => !uniques.some((u) => u === x.unique)
      ) ?? [];

    this.#data.update({
      items,
    });
  }

  async updateStatus<T extends { unique: string; status: StatusModel }>(
    uniques: Array<string>,
    status: StatusModel,
    getArray: ObservableArrayGetterFnType<T>,
    setArray: ObservableArraySetterFnType<T>
  ) {
    const arr = (await firstValueFrom(getArray(this))) ?? [];
    const forUpdate = arr.map((x) => ({
      ...x,
      ...{
        status: uniques.includes(x.unique) ? status : x.status,
      },
    }));

    setArray(this.#data, forUpdate);
  }

  #onVersionUpdatedEvent = async (event: UmbEntityUpdatedEvent) => {
    const [unique, parentUnique] = event.getUnique()?.split("_") ?? [];
    if (!unique || !parentUnique) return;

    let document = this.getData()?.items.find((x) => x.unique === parentUnique);
    if (!document) return;

    // if the version exists, we don't need to do anything - it will have possibly
    // been updated and saved in the modal. We only need to continue
    // if the version is not already part of the set.
    const version = document?.items.find((x) => x.unique === unique);
    if (version) return;

    const { data } = await this.#versionRepository.requestByUnique(unique);
    if (!data) return;

    this.updateItem({
      ...document,
      items: appendToFrozenArray(document.items, {
        ...data,
        entityType: RELEASESET_VERSION_ENTITY_TYPE,
        name: data.versionName ?? "",
        expireAction: "Revert",
        nodeUnique: data.parentUnique,
        status: "Draft",
      }),
    });
  };

  destroy(): void {
    this.#detailRepository.destroy();
    this.#versionRepository.destroy();
    super.destroy();
  }
}

export { WorkflowReleaseSetWorkspaceContext as api };
