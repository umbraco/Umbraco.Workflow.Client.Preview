import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import {
  customElement,
  html,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import {} from "@umbraco-cms/backoffice/modal";
import type { UmbInputDocumentElement } from "@umbraco-cms/backoffice/document";
import { WORKFLOW_SETTINGS_WORKSPACE_CONTEXT } from "../../workspace/settings-workspace.context-token.js";
import type { GeneralSettingsModel } from "@umbraco-workflow/generated";

const elementName = "workflow-exclude-nodes";

@customElement(elementName)
export class WorkflowExcludeNodesElement extends UmbLitElement {
  workspaceContext?: typeof WORKFLOW_SETTINGS_WORKSPACE_CONTEXT.TYPE;

  @state()
  _generalSettings?: GeneralSettingsModel;

  @state()
  selectedIds: Array<string> = [];

  constructor() {
    super();

    this.consumeContext(WORKFLOW_SETTINGS_WORKSPACE_CONTEXT, (context) => {
      if (!context) return;
      this.workspaceContext = context;

      this.observe(this.workspaceContext.generalSettings, (settings) => {
        this._generalSettings = settings;
      });
    });
  }

  #onSelectionChange(event: CustomEvent) {
    const selectedIds = (event.target as UmbInputDocumentElement).selection;
    this.workspaceContext?.setValue(
      selectedIds.join(","),
      "excludeNodes",
      "generalSettings"
    );
  }

  render() {
    return html` <umb-input-document
      .value=${(this._generalSettings?.excludeNodes?.value as string) ?? ""}
      @change=${this.#onSelectionChange}
    ></umb-input-document>`;
  }
}

export default WorkflowExcludeNodesElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowExcludeNodesElement;
  }
}
