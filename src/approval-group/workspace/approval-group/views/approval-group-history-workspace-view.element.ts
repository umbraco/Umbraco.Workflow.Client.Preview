import {
  css,
  html,
  customElement,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import type { UmbWorkspaceViewElement } from "@umbraco-cms/backoffice/extension-registry";
import { WorkflowApprovalGroupWorkspaceViewBase } from "./approval-group-workspace-view-base.element.js";
import { WorkflowDetailModalRouterController, type TableQueryModel } from "@umbraco-workflow/core";
import { InstanceService } from "@umbraco-workflow/generated";
import { InstanceFilters } from "@umbraco-workflow/components";

const elementName = "workflow-approval-group-members-workspace-view";

@customElement(elementName)
export class ApprovalGroupMembersWorkspaceViewElement
  extends WorkflowApprovalGroupWorkspaceViewBase
  implements UmbWorkspaceViewElement
{
  @state()
  _config?: TableQueryModel;

  constructor() {
    super();
    new WorkflowDetailModalRouterController(this);
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.init;

    this._config = {
      handler: InstanceService.postInstanceAll,
      filterConfig: new InstanceFilters({ groupId: this._group?.unique }),
    };
  }

  render() {
    if (!this._config) return;

    return html`<workflow-table .config=${this._config}>
      <workflow-instances-table></workflow-instances-table>
    </workflow-table>`;
  }

  static styles = [
    css`
      :host {
        display: block;
        padding: var(--uui-size-space-6);
      }
    `,
  ];
}

export default ApprovalGroupMembersWorkspaceViewElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: ApprovalGroupMembersWorkspaceViewElement;
  }
}
