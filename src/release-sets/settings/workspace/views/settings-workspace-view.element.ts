import type { UmbWorkspaceViewElement } from "@umbraco-cms/backoffice/workspace";
import {
  customElement,
  html,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import {
  UmbPropertyDatasetElement,
  UmbPropertyValueData,
} from "@umbraco-cms/backoffice/property";
import { SettingsPropertyDisplayModel } from "@umbraco-workflow/generated";
import { WORKFLOW_RELEASESET_SETTINGS_WORKSPACE_CONTEXT } from "../settings-workspace.context-token.js";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { WorkspaceWithSettingsViewBaseElement } from "@umbraco-workflow/settings";

const elementName = "workflow-releaseset-settings-workspace-view";

@customElement(elementName)
export class WorkflowReleaseSetSettingsWorkspaceViewElement
  extends UmbLitElement
  implements UmbWorkspaceViewElement
{
  workspaceContext?: typeof WORKFLOW_RELEASESET_SETTINGS_WORKSPACE_CONTEXT.TYPE;

  @state()
  _properties?: Array<SettingsPropertyDisplayModel>;

  constructor() {
    super();

    this.consumeContext(
      WORKFLOW_RELEASESET_SETTINGS_WORKSPACE_CONTEXT,
      (instance) => {
        if (!instance) return;
        this.workspaceContext = instance;

        this.observe(instance.data, (data) => {
          this._properties = data?.properties;
        });
      }
    );
  }

  onDataChange(e: Event) {
    const newValue = (e.target as UmbPropertyDatasetElement).value;
    this._properties?.forEach((p) => {
      this.workspaceContext?.setPropertyValue(
        newValue.find((x) => x.alias === p.alias)?.value,
        p.alias
      );
    });
  }

  renderPropertyDataSet() {
    return html` <umb-property-dataset
      id="main"
      .value=${this._properties as Array<UmbPropertyValueData>}
      @change=${(e: Event) => this.onDataChange(e)}
    >
      ${this._properties?.map(
        (p) =>
          html`<umb-property
            ?inert=${p.readonly}
            ?hidden=${p.hidden}
            .label=${this.localize.term(`workflow_property_${p.alias}`)}
            .description=${this.localize.term(
              `workflow_propertyDescription_${p.alias}`
            )}
            .config=${p.config}
            alias=${p.alias}
            property-editor-ui-alias=${p.editorUiAlias}
          ></umb-property>`
      )}
    </umb-property-dataset>`;
  }

  render() {
    return html` <div id="flexyboi">
      <uui-box headline=${this.localize.term("general_general")}>
        ${this.renderPropertyDataSet()}
      </uui-box>
    </div>`;
  }

  static styles = [...WorkspaceWithSettingsViewBaseElement.styles];
}

export default WorkflowReleaseSetSettingsWorkspaceViewElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowReleaseSetSettingsWorkspaceViewElement;
  }
}
