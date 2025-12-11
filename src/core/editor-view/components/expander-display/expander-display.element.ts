import { umbExtensionsRegistry } from "@umbraco-cms/backoffice/extension-registry";
import {
  css,
  customElement,
  html,
  property,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { UmbPropertyEditorConfig } from "@umbraco-cms/backoffice/property-editor";
import { WORKFLOW_EXPANSION_TYPE_ALIAS } from "../../../initializers/index.js";

const elementName = "workflow-expander-display";

@customElement(elementName)
export class WorkflowExpanderDisplayElement extends UmbLitElement {
  @property({ type: Object })
  value: Record<string, unknown> | undefined | null;

  @property()
  entityType: string | null | undefined;

  @state()
  private _expanders: Array<{
    alias: string;
    label: string;
    propertyEditorUiAlias: string;
    config: UmbPropertyEditorConfig | undefined;
    value: any;
  }> = [];

  connectedCallback(): void {
    super.connectedCallback();
    if (!this.value || !this.entityType) return;

    this.observe(
      umbExtensionsRegistry.byTypeAndFilter(
        WORKFLOW_EXPANSION_TYPE_ALIAS,
        (x) => x.entityType === this.entityType
      ),
      (expanders) => {
        this._expanders = expanders
          .flatMap((x) => x.meta.properties)
          .filter((x) => !x.core && this.value?.[x.alias] !== undefined)
          .map((x) => ({
            alias: x.alias,
            label: x.label,
            propertyEditorUiAlias: x.propertyEditorUiAlias,
            config: x.config,
            value: this.value?.[x.alias],
          }));
      }
    );
  }

  render() {
    if (!this._expanders.length) return;

    return html` <umb-property-dataset .value=${this._expanders}>
      ${this._expanders.map((expander) => {
        return html`<umb-property
          label=${expander.label}
          alias=${expander.alias}
          property-editor-ui-alias=${expander.propertyEditorUiAlias}
          .config=${expander.config}
          readonly
        ></umb-property>`;
      })}
    </umb-property-dataset>`;
  }

  static styles = css`
    umb-property-dataset {
      --uui-size-layout-1: var(--uui-size-2);
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowExpanderDisplayElement;
  }
}
