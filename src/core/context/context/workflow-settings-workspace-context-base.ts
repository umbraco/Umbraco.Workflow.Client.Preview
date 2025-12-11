import { UmbSubmittableWorkspaceContextBase } from "@umbraco-cms/backoffice/workspace";
import { WorkflowSettingsWorkspaceContextCtorArgs } from "../entities.js";
import { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import {
  appendToFrozenArray,
  UmbObjectState,
} from "@umbraco-cms/backoffice/observable-api";
import { WorkflowRepositoryBase } from "@umbraco-workflow/repository";
import { SettingsPropertyDisplayModel } from "@umbraco-workflow/generated";

export abstract class WorkflowSettingsWorkspaceContextBase<
  SettingsEntityType extends object,
  SaveModelType = SettingsEntityType
> extends UmbSubmittableWorkspaceContextBase<SettingsEntityType> {
  #unique = new UmbObjectState<string | undefined>(undefined);
  unique = this.#unique.asObservable();

  public readonly repository?: WorkflowRepositoryBase<
    SettingsEntityType,
    SaveModelType
  >;

  abstract load(): void | Promise<void>;

  abstract getProperties(key?: string): Array<SettingsPropertyDisplayModel>;
  abstract setProperties(
    properties: Array<SettingsPropertyDisplayModel>,
    key?: string
  ): void;

  constructor(
    host: UmbControllerHost,
    args: WorkflowSettingsWorkspaceContextCtorArgs<
      SettingsEntityType,
      SaveModelType
    >
  ) {
    super(host, args.workspaceAlias);

    this.view.setTitle(args.title);
    this.repository = new args.repositoryCtor(this);
    this.#unique.setValue(args.entityTypeAlias);

    this.provideContext(args.contextToken, this);
    this.load();
  }

  getData(): SettingsEntityType | undefined {
    return undefined;
  }

  getEntityType() {
    return this.#unique.getValue() ?? "";
  }

  getUnique() {
    return this.#unique.getValue();
  }

  updatePropertyValue<ValueType>(
    properties: SettingsPropertyDisplayModel[],
    value: ValueType,
    alias: string
  ) {
    const property = {
      ...properties.find((p) => p.alias === alias),
      ...{ value },
    } as SettingsPropertyDisplayModel;

    const newProperties = appendToFrozenArray(
      properties,
      property,
      (x) => x.alias
    );

    return newProperties;
  }

  setPropertyValue<ValueType>(
    value: ValueType,
    alias: string,
    parent?: string
  ) {
    const properties = this.getProperties(parent);
    if (!properties) return;

    const updated = this.updatePropertyValue(properties, value, alias);
    this.setProperties(updated, parent);
  }

  destroy() {
    this.repository?.destroy();
    super.destroy();
  }
}
