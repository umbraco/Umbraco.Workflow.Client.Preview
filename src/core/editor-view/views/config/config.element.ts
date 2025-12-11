import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import {
  css,
  customElement,
  html,
  state,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import {
  WORKFLOW_CONTEXT,
  WORKFLOW_MANAGER_CONTEXT,
} from "@umbraco-workflow/context";
import { UMB_DOCUMENT_ENTITY_TYPE } from "@umbraco-cms/backoffice/document";

const elementName = "workflow-workspace-config";

@customElement(elementName)
export class WorkflowWorkspaceConfigElement extends UmbLitElement {
  @state()
  private _contentReviewsEnabled = false;

  @state()
  private _excluded = false;

  @state()
  private _entityType = "";

  constructor() {
    super();

    this.consumeContext(WORKFLOW_CONTEXT, (context) => {
      this.observe(context?.globalVariables, (globalVariables) => {
        this._contentReviewsEnabled =
          globalVariables?.contentReviewsEnabled ?? false;
      });
    });

    this.consumeContext(WORKFLOW_MANAGER_CONTEXT, (context) => {
      this.observe(context?.state, (state) => {
        if (!state) return;
        this._excluded = state.exclude ?? false;
        this._entityType = state.entityType ?? "";
      });
    });
  }

  render() {
    return html` ${when(
        this._excluded,
        () => html`
          <workflow-alert key="workflow_excludedNodeAlert"></workflow-alert>
        `
      )}
      <div id="main">
        <workflow-config-content></workflow-config-content>
        ${when(
          this._entityType === UMB_DOCUMENT_ENTITY_TYPE,
          () => html` <div>
            <workflow-config-display
              approvalType="inherited"
            ></workflow-config-display>

            <workflow-config-display
              approvalType="contentType"
            ></workflow-config-display>

            ${when(
              this._contentReviewsEnabled,
              () =>
                html` <workflow-config-content-reviews></workflow-config-content-reviews>`
            )}
          </div>`
        )}
      </div>`;
  }

  static styles = [
    css`
      :host {
        --uui-size-layout-1: var(--uui-size-8);
        padding: var(--uui-size-layout-1);
        flex-direction: column;
      }

      :host,
      #main {
        display: flex;
        gap: var(--uui-size-layout-1);
      }

      #main > * {
        flex: 1;
        align-self: baseline;
      }

      workflow-config-display {
        margin-bottom: var(--uui-size-layout-1);
      }
    `,
  ];
}

export default WorkflowWorkspaceConfigElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowWorkspaceConfigElement;
  }
}
