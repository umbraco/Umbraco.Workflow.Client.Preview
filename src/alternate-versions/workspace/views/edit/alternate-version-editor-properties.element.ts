import {
  css,
  customElement,
  html,
  property,
  repeat,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import {
  UmbContentTypePropertyStructureHelper,
  type UmbPropertyTypeModel,
} from "@umbraco-cms/backoffice/content-type";
import type { UmbVariantId } from "@umbraco-cms/backoffice/variant";
import { UmbDataPathPropertyValueQuery } from "@umbraco-cms/backoffice/validation";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { UmbTextStyles } from "@umbraco-cms/backoffice/style";
import { WORKFLOW_ALTERNATEVERSION_WORKSPACE_CONTEXT } from "../../context/alternate-version-workspace.context-token.js";
import { WORKFLOW_ALTERNATEVERSION_PROPERTY_DATASET_CONTEXT } from "../../context/alternate-version-property-dataset.context-token.js";

const elementName = "alternate-version-workspace-view-edit-properties";

@customElement(elementName)
export class AlternateVersionWorkspaceViewEditPropertiesElement extends UmbLitElement {
  @property({ type: String, attribute: "container-id", reflect: false })
  public get containerId(): string | null | undefined {
    return this.#propertyStructureHelper.getContainerId();
  }
  public set containerId(value: string | null | undefined) {
    this.#propertyStructureHelper.setContainerId(value);
  }

  #workspaceContext?: typeof WORKFLOW_ALTERNATEVERSION_WORKSPACE_CONTEXT.TYPE;

  #propertyStructureHelper = new UmbContentTypePropertyStructureHelper(this);
  #variantId?: UmbVariantId;

  @state()
  _propertyStructure?: Array<UmbPropertyTypeModel>;

  @state()
  _dataPaths?: Array<string>;

  constructor() {
    super();

    this.consumeContext(
      WORKFLOW_ALTERNATEVERSION_WORKSPACE_CONTEXT,
      (workspaceContext) => {
        if (!workspaceContext) return;
        this.#workspaceContext = workspaceContext;
        this.#setStructureManager();
      }
    );

    this.consumeContext(
      WORKFLOW_ALTERNATEVERSION_PROPERTY_DATASET_CONTEXT,
      (datasetContext) => {
        if (!datasetContext) return;
        this.#variantId = datasetContext.getVariantId();
        this.#generatePropertyDataPath();
      }
    );
  }

  #setStructureManager() {
    if (!this.#workspaceContext) return;

    this.#propertyStructureHelper.setStructureManager(
      this.#workspaceContext.structure
    );

    this.observe(
      this.#propertyStructureHelper.propertyStructure,
      (propertyStructure) => {
        this._propertyStructure = propertyStructure;
        this.#generatePropertyDataPath();
      }
    );
  }

  #generatePropertyDataPath() {
    if (!this.#variantId || !this._propertyStructure) return;
    this._dataPaths = this._propertyStructure.map(
      (property) =>
        `$.values[${UmbDataPathPropertyValueQuery({
          alias: property.alias,
          culture: property.variesByCulture ? this.#variantId!.culture : null,
          segment: property.variesBySegment ? this.#variantId!.segment : null,
        })}].value`
    );
  }

  override render() {
    return this._propertyStructure && this._dataPaths
      ? repeat(
          this._propertyStructure,
          (property) => property.alias,
          (property, index) =>
            html`<umb-property-type-based-property
              class="property"
              data-path=${this._dataPaths![index]}
              .property=${property}
            ></umb-property-type-based-property> `
        )
      : "";
  }

  static override styles = [
    UmbTextStyles,
    css`
      .property {
        border-bottom: 1px solid var(--uui-color-divider);
      }
      .property:last-child {
        border-bottom: 0;
      }
    `,
  ];
}

export default AlternateVersionWorkspaceViewEditPropertiesElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: AlternateVersionWorkspaceViewEditPropertiesElement;
  }
}
