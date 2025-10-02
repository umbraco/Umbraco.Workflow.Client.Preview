import {
  css,
  customElement,
  html,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import type {
  UmbPropertyDatasetElement,
  UmbPropertyValueData,
} from "@umbraco-cms/backoffice/property";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { AdvancedSearchFieldElement } from "../../../entities.js";

import { baseProperties } from "./base-properties.js";
import { UmbChangeEvent } from "@umbraco-cms/backoffice/event";

const elementName = "workflow-advanced-search-base-property";

@customElement(elementName)
export class WorkflowAdvancedSearchBasePropertyElement
  extends UmbLitElement
  implements AdvancedSearchFieldElement
{
  @state()
  private _baseProperties = baseProperties;

  @state()
  value: Array<UmbPropertyValueData> = [];

  #onValueChange(e: Event) {
    this.value = (e.target as UmbPropertyDatasetElement).value.filter(
      (x) => x.value !== undefined
    );

    this.dispatchEvent(new UmbChangeEvent());
  }

  render() {
    return html`<hr />
      <div id="baseProperties">
        <umb-property-dataset
          .value=${this.value}
          @change=${this.#onValueChange}
        >
          ${this._baseProperties.map(
            (prop) =>
              html`<umb-property
                orientation="vertical"
                alias=${prop.alias!}
                label=${prop.name!}
                property-editor-ui-alias=${prop.propertyEditorUiAlias!}
                .config=${prop.config}
              ></umb-property>`
          )}
        </umb-property-dataset>
      </div>`;
  }

  static styles = css`
    uui-box {
      container-type: inline-size;
    }

    hr {
      margin-top: var(--uui-size-5);
    }

    @container (min-width: 500px) {
      #baseProperties umb-property-dataset {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        grid-column-gap: 20px;
      }

      #baseProperties umb-property-dataset > *:nth-child(1) {
        grid-column: 1 / 3;
      }

      #baseProperties umb-property-dataset > *:nth-child(2) {
        grid-column: 1 / 2;
      }

      #baseProperties umb-property-dataset > *:nth-child(3) {
        grid-column: 2 / 3;
      }
    }

    @container (min-width: 950px) {
      #baseProperties umb-property-dataset {
        grid-template-columns: repeat(4, minmax(0, 1fr));
      }

      #baseProperties umb-property-dataset > *:nth-child(1) {
        grid-column: 1 / 5;
      }

      #baseProperties umb-property-dataset > *:nth-child(2) {
        grid-column: 1 / 3;
      }

      #baseProperties umb-property-dataset > *:nth-child(3) {
        grid-column: 3 / 5;
      }
    }
  `;
}

export default WorkflowAdvancedSearchBasePropertyElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowAdvancedSearchBasePropertyElement;
  }
}
