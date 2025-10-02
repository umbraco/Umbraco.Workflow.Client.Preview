import {
  css,
  customElement,
  html,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import type { UmbWorkspaceViewElement } from "@umbraco-cms/backoffice/workspace";
import { WORKFLOW_RELEASESET_WORKSPACE_CONTEXT } from "../../release-set-workspace.context-token.js";
import { WORKFLOW_RELEASESET_DAY_DETAIL_MODAL } from "../../../calendar/index.js";
import { WorkflowReleaseSetCalendarContext } from "src/release-sets/calendar/release-set-calendar.context.js";

const elementName = "workflow-releaseset-editor";

@customElement(elementName)
export class WorkflowReleaseSetWorkspaceViewEditElement
  extends UmbLitElement
  implements UmbWorkspaceViewElement
{
  #workspaceContext?: typeof WORKFLOW_RELEASESET_WORKSPACE_CONTEXT.TYPE;

  @state()
  private _unique?: string;

  constructor() {
    super();

    this.consumeContext(WORKFLOW_RELEASESET_WORKSPACE_CONTEXT, (context) => {
      this.#workspaceContext = context;
      this.#observeEntity();
    });
  }

  #observeEntity() {
    if (!this.#workspaceContext) return;

    this.observe(this.#workspaceContext.unique, (unique) => {
      if (!unique) return;
      this._unique = unique;

      new WorkflowReleaseSetCalendarContext(this, {
        hideLegend: true,
        detailModalToken: WORKFLOW_RELEASESET_DAY_DETAIL_MODAL,
      });
    });
  }

  render() {
    if (!this._unique) return;

    return html`<umb-body-layout header-fit-height>
      <div id="items">
        <div>
          <workflow-release-set-items></workflow-release-set-items>
          <workflow-release-set-tasks></workflow-release-set-tasks>
        </div>
        <workflow-content-calendar></workflow-content-calendar>
      </div>
    </umb-body-layout>`;
  }

  static styles = css`
    #items {
      width: 100%;
      display: flex;
      flex-direction: row;
      gap: var(--uui-size-layout-1);
    }

    #items > div {
      flex: 1;
    }

    #items > *:last-child {
      display: block;
      flex: 0 1 60%;
    }
  `;
}

export default WorkflowReleaseSetWorkspaceViewEditElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowReleaseSetWorkspaceViewEditElement;
  }
}
