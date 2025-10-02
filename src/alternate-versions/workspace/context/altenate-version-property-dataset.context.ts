import {
  UMB_PROPERTY_DATASET_CONTEXT,
  type UmbPropertyValueData,
  type UmbPropertyDatasetContext,
} from "@umbraco-cms/backoffice/property";

import {
  firstValueFrom,
  of,
  type Observable,
} from "@umbraco-cms/backoffice/external/rxjs";
import {
  mergeObservables,
  UmbBooleanState,
  UmbClassState,
} from "@umbraco-cms/backoffice/observable-api";
import { UmbVariantId } from "@umbraco-cms/backoffice/variant";
import type { UmbPropertyTypeModel } from "@umbraco-cms/backoffice/content-type";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { UmbContextBase } from "@umbraco-cms/backoffice/class-api";
import { ALTERNATEVERSION_ENTITY_TYPE } from "../../constants.js";
import { WORKFLOW_ALTERNATEVERSION_WORKSPACE_CONTEXT } from "./alternate-version-workspace.context-token.js";
import { WORKFLOW_ALTERNATEVERSION_PROPERTY_DATASET_CONTEXT } from "./alternate-version-property-dataset.context-token.js";

export class WorkflowAlternatVersionPropertyDatasetContext
  extends UmbContextBase
  implements UmbPropertyDatasetContext
{
  #workspaceContext?: typeof WORKFLOW_ALTERNATEVERSION_WORKSPACE_CONTEXT.TYPE;
  #unique?: string;

  #variantId = new UmbClassState<UmbVariantId | undefined>(undefined);
  readonly variantId = this.#variantId.asObservable();

  #readOnly = new UmbBooleanState(false);
  public readOnly = this.#readOnly.asObservable();

  getEntityType() {
    return ALTERNATEVERSION_ENTITY_TYPE;
  }

  getUnique() {
    return this.#unique ?? "";
  }

  getName(): string | undefined {
    return "";
  }

  readonly name: Observable<string | undefined> = of("");

  constructor(
    host: UmbControllerHost,
    unique?: string,
    variantId?: UmbVariantId
  ) {
    super(host, UMB_PROPERTY_DATASET_CONTEXT.toString());

    this.#unique = unique;
    this.#variantId.setValue(variantId ?? UmbVariantId.CreateInvariant());

    this.consumeContext(
      WORKFLOW_ALTERNATEVERSION_WORKSPACE_CONTEXT,
      (context) => {
        this.#workspaceContext = context;
      }
    );

    this.provideContext(
      WORKFLOW_ALTERNATEVERSION_PROPERTY_DATASET_CONTEXT,
      this
    );
  }

  get properties(): Observable<UmbPropertyValueData<unknown>[] | undefined> {
    return of([]);
  }
  getProperties(): Promise<Array<UmbPropertyValueData> | undefined> {
    throw new Error("Method not implemented.");
  }

  getVariantId() {
    return this.#variantId.getValue()!;
  }

  async propertyVariantId(
    propertyAlias: string
  ): Promise<Observable<UmbVariantId | undefined>> {
    if (!this.#workspaceContext)
      throw new Error("Workspace context is missing");

    return mergeObservables(
      [
        await this.#workspaceContext.structure.propertyStructureByAlias(
          propertyAlias
        ),
        this.variantId,
      ],
      ([property, variantId]) =>
        property && variantId
          ? this.#createPropertyVariantId(property, variantId)
          : undefined
    );
  }

  async propertyValueByAlias<ReturnType = unknown>(propertyAlias: string) {
    if (!this.#workspaceContext)
      throw new Error("Workspace context is missing");

    return mergeObservables(
      [
        this.#workspaceContext.data.asObservablePart((data) =>
          data?.values?.filter((x) => x?.alias === propertyAlias)
        ),
        await this.propertyVariantId(propertyAlias),
      ],
      ([propertyValues, propertyVariantId]) => {
        if (!propertyValues || !propertyVariantId) return;

        return propertyValues.find((x) =>
          propertyVariantId.compare({
            ...x,
            ...{ culture: x.culture ?? null, segment: x.segment ?? null },
          })
        )?.value as ReturnType;
      }
    );
  }

  async setPropertyValue(alias: string, value: PromiseLike<unknown>) {
    const propertyVariant = await firstValueFrom(
      await this.propertyVariantId(alias)
    );
    this.#workspaceContext?.setValue(
      alias,
      value,
      propertyVariant ?? UmbVariantId.CreateInvariant()
    );
  }

  getReadOnly(): boolean {
    return this.#readOnly.getValue();
  }

  #createPropertyVariantId(
    property: UmbPropertyTypeModel,
    variantId: UmbVariantId
  ) {
    return UmbVariantId.Create({
      culture: property.variesByCulture ? variantId.culture : null,
      segment: property.variesBySegment ? variantId.segment : null,
    });
  }
}
