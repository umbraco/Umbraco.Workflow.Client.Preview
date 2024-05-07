import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import {
  LitElement,
  customElement,
  html,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import {} from "@umbraco-cms/backoffice/modal";
import type { UmbInputDocumentElement } from "@umbraco-cms/backoffice/document";
import { splitStringToArray } from "@umbraco-cms/backoffice/utils";
import { WORKFLOW_SETTINGS_WORKSPACE_CONTEXT } from "../../workspace/settings-workspace.context-token.js";
import type { GeneralSettingsModel } from "@umbraco-workflow/generated";

const elementName = "workflow-exclude-nodes";

@customElement(elementName)
export class WorkflowExcludeNodesElement extends UmbElementMixin(LitElement) {
  workspaceContext?: typeof WORKFLOW_SETTINGS_WORKSPACE_CONTEXT.TYPE;

  @state()
  _generalSettings?: GeneralSettingsModel;

  @state()
  selectedIds: Array<string> = [];

  constructor() {
    super();

    this.consumeContext(WORKFLOW_SETTINGS_WORKSPACE_CONTEXT, (instance) => {
      this.workspaceContext = instance;

      this.observe(this.workspaceContext.generalSettings, (settings) => {
        this._generalSettings = settings;
      });
    });
  }

  connectedCallback() {
    super.connectedCallback();
    this.selectedIds = splitStringToArray(
      this._generalSettings?.excludeNodes?.value as string
    );
  }

  #onSelectionChange(event: CustomEvent) {
    this.selectedIds = (event.target as UmbInputDocumentElement).selection;
    this.workspaceContext?.setValue(
      this.selectedIds.join(","),
      "excludeNodes",
      "generalSettings"
    );
  }

  render() {
    return html` <umb-input-document
      .selectedIds=${this.selectedIds}
      @change=${this.#onSelectionChange}
    ></umb-input-document>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowExcludeNodesElement;
  }
}
