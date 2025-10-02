import {
  css,
  html,
  customElement,
  state,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import type { UmbWorkspaceViewElement } from "@umbraco-cms/backoffice/workspace";
import { tryExecute } from "@umbraco-cms/backoffice/resources";
import type { UmbUserInputElement } from "@umbraco-cms/backoffice/user";
import { WorkflowApprovalGroupWorkspaceViewBaseElement } from "./approval-group-workspace-view-base.element.js";
import { ApprovalGroupService } from "@umbraco-workflow/generated";

const elementName = "workflow-approval-group-history-workspace-view";

@customElement(elementName)
export class ApprovalGroupHistoryWorkspaceViewElement
  extends WorkflowApprovalGroupWorkspaceViewBaseElement
  implements UmbWorkspaceViewElement
{
  @state()
  private _inheritedMembers?: Array<{
    userUnique: string;
    userName?: string | null;
    disabled?: boolean;
  }> = [];

  async connectedCallback() {
    super.connectedCallback();
    await this.init;

    if (this._group) {
      this._group = {
        ...this._group,
        ...{ users: this._group.users.filter((x) => !x.inherited) },
      };
    }

    this.#getInheritedGroupMembers();
  }

  /**
   * */
  async #getInheritedGroupMembers() {
    if (!this._group) return;

    // when no inheritance, also remove users from the UI
    if (!this._group.inheritMembers) {
      this._inheritedMembers = [];
      return;
    }

    const { data } = await tryExecute(
      this,
      ApprovalGroupService.getApprovalGroupInheritedMembers({
        query: {
          ids: this._group.inheritMembers,
        },
      })
    );

    // remove duplicates - user may be in multiple groups
    this._inheritedMembers = Array.from(new Set(data));

    // finally, if the user is explicitly added, update ui to show as disabled;
    this._inheritedMembers.forEach((u) => {
      u.disabled = this._group?.users.some(
        (x) => x.userUnique === u.userUnique && !x.inherited
      );
    });
  }

  #onUserSelectionChange(e: CustomEvent) {
    const selection = (e.target as UmbUserInputElement).selection;

    this._inheritedMembers?.forEach((x) => {
      x.disabled = selection.includes(x.userUnique);
    });

    this.workspaceContext?.set({
      users: selection.map((x) => ({ userUnique: x, inherited: false })),
    });

    this.requestUpdate();
  }

  async #onGroupSelectionChange(e: Event) {
    const selection = (e.target as UmbUserInputElement).selection;
    this.workspaceContext?.set({ inheritMembers: selection.join(",") });
    this.#getInheritedGroupMembers();
  }

  render() {
    return html`<div class="flex">
      <uui-box .headline=${this.localize.term("workflow_membership")}>
        <umb-user-input
          @change=${this.#onUserSelectionChange}
          .selection=${this._group?.users
            .filter((x) => !x.inherited)
            .map((u) => u.userUnique) ?? []}
        ></umb-user-input>
      </uui-box>
      <uui-box .headline=${this.localize.term("workflow_inheritedMembership")}>
        <umb-user-group-input
          @change=${this.#onGroupSelectionChange}
          .value=${this._group?.inheritMembers}
        ></umb-user-group-input>
        ${when(
          this._inheritedMembers?.length,
          () => html` <uui-ref-list>
            ${this._inheritedMembers?.map(
              (x) =>
                html`<uui-ref-node-user
                  .name=${x.userName ?? ""}
                  ?disabled=${x.disabled ?? false}
                ></uui-ref-node-user>`
            )}
          </uui-ref-list>`
        )}
      </uui-box>
    </div>`;
  }

  static styles = [
    css`
      :host {
        display: block;
        padding: var(--uui-size-space-6);
      }

      .flex {
        display: flex;
        gap: var(--uui-size-space-4);
      }

      uui-box {
        flex: 1;
        align-self: flex-start;
      }

      uui-ref-list {
        margin-top: var(--uui-size-space-6);
      }
    `,
  ];
}

export default ApprovalGroupHistoryWorkspaceViewElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: ApprovalGroupHistoryWorkspaceViewElement;
  }
}
