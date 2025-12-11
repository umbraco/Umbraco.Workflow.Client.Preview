import {
  customElement,
  html,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { WORKFLOW_SETTINGS_WORKSPACE_CONTEXT } from "./settings-workspace.context-token";
import { umbExtensionsRegistry } from "@umbraco-cms/backoffice/extension-registry";
import { ManifestWorkflowSettingsWorkspaceProvider } from "../types";
import { createExtensionApi } from "@umbraco-cms/backoffice/extension-api";
import { WORKFLOW_SETTINGS_WORKSPACE_PROVIDER } from "../constants";
import { UmbSubmittableWorkspaceContext } from "@umbraco-cms/backoffice/workspace";

const elementName = "workflow-settings-workspace-editor";

@customElement(elementName)
export class WorkflowSettingsWorkspaceEditorElement extends UmbLitElement {
  @state()
  private _manifest?: ManifestWorkflowSettingsWorkspaceProvider;

  constructor() {
    super();

    this.consumeContext(WORKFLOW_SETTINGS_WORKSPACE_CONTEXT, (context) => {
      if (!context) return;

      this.observe(context.unique, async (unique) => {
        this.#generateWorkspaceContext(unique);
      });
    });
  }

  async #generateWorkspaceContext(unique?: string) {
    if (!unique) return;

    const manifest = umbExtensionsRegistry
      .getByTypeAndFilter(
        WORKFLOW_SETTINGS_WORKSPACE_PROVIDER,
        (x) => x.meta.entityType === unique
      )
      .at(0);

    if (!manifest) return;
    this._manifest = manifest;

    const api = await createExtensionApi(this, manifest, [
      {
        title: this.localize.string(manifest.meta.label),
      },
    ]);

    if (!api) return;

    this.provideContext(
      WORKFLOW_SETTINGS_WORKSPACE_CONTEXT,
      api as UmbSubmittableWorkspaceContext
    );
  }

  render() {
    return html`<umb-workspace-editor
      headline=${this.localize.string(this._manifest?.meta.label ?? "")}
    >
    </umb-workspace-editor>`;
  }
}

export default WorkflowSettingsWorkspaceEditorElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowSettingsWorkspaceEditorElement;
  }
}
