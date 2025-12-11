import { html } from "@umbraco-cms/backoffice/external/lit";
import type { UmbPropertyDatasetElement } from "@umbraco-cms/backoffice/property";
import { WORKFLOW_CONTENTAPPROVAL_SETTINGS_WORKSPACE_CONTEXT } from "../settings-workspace.context-token.js";
import { WorkspaceWithSettingsViewBaseElement } from "@umbraco-workflow/settings";
import type {
  SettingsPropertyDisplayModel,
  WorkflowSettingsPropertiesModel,
} from "@umbraco-workflow/generated";

export class WorkflowSettingsWorkspaceViewBase extends WorkspaceWithSettingsViewBaseElement {
  protected workspaceContext?: typeof WORKFLOW_CONTENTAPPROVAL_SETTINGS_WORKSPACE_CONTEXT.TYPE;

  constructor() {
    super();

    this.consumeContext(
      WORKFLOW_CONTENTAPPROVAL_SETTINGS_WORKSPACE_CONTEXT,
      (context) => (this.workspaceContext = context)
    );
  }

  onDataChange(e: Event, sectionAlias: keyof WorkflowSettingsPropertiesModel) {
    const newValue = (e.target as UmbPropertyDatasetElement).value;
    const properties = this.workspaceContext?.getProperties(sectionAlias) ?? [];
    this.workspaceContext?.setProperties(
      properties.map((p) => ({
        ...p,
        value: newValue.find((x) => x.alias === p.alias)?.value,
      })),
      sectionAlias
    );
  }

  renderPropertyDataSet(
    alias: keyof WorkflowSettingsPropertiesModel,
    value: Array<SettingsPropertyDisplayModel> = []
  ) {
    return html` <umb-property-dataset
      .value=${value}
      @change=${(e: Event) => this.onDataChange(e, alias)}
    >
      ${value.map(
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
}

export default WorkflowSettingsWorkspaceViewBase;
