import { css, html, customElement } from "@umbraco-cms/backoffice/external/lit";
import type { UmbWorkspaceViewElement } from "@umbraco-cms/backoffice/extension-registry";
import { tryExecuteAndNotify } from "@umbraco-cms/backoffice/resources";
import {
  UserGroupService,
  type UserGroupResponseModel,
} from "@umbraco-cms/backoffice/external/backend-api";
import { WorkflowApprovalGroupWorkspaceViewBase } from "./approval-group-workspace-view-base.element.js";
import {
  type User2UserGroupModel,
  type WorkflowLicenseModel,
  ApprovalGroupService,
} from "@umbraco-workflow/generated";
import { WORKFLOW_CONTEXT } from "@umbraco-workflow/context";

const elementName = "workflow-approval-group-history-workspace-view";

@customElement(elementName)
export class ApprovalGroupHistoryWorkspaceViewElement
  extends WorkflowApprovalGroupWorkspaceViewBase
  implements UmbWorkspaceViewElement
{
  #workflowGlobalContext?: typeof WORKFLOW_CONTEXT.TYPE;

  inheritedGroups: Array<UserGroupResponseModel> = [];
  allGroups: Array<UserGroupResponseModel> = [];

  license?: WorkflowLicenseModel;

  constructor() {
    super();

    this.consumeContext(WORKFLOW_CONTEXT, (instance) => {
      this.#workflowGlobalContext = instance;
      this.#observeLicense();
    });
  }

  async connectedCallback() {
    super.connectedCallback();
    await this.init;
    this.#getInheritedGroups();
  }

  #observeLicense() {
    if (!this.#workflowGlobalContext) return;
    this.observe(this.#workflowGlobalContext.license, (license) => {
      this.license = license;
    });
  }

  // TODO => userGroupResource import blow up
  async #getInheritedGroups() {
    const { data, error } = await tryExecuteAndNotify(
      this,
      UserGroupService.getUserGroup({ skip: 0, take: 1000 })
    );
    if (error || !data) {
      return;
    }

    this.allGroups = data.items;

    const ids = this._group?.inheritMembers?.split(",");
    this.inheritedGroups =
      this.allGroups.filter((g) => ids?.includes(g.id!)) ?? [];
  }

  /**
   * */
  async #getInheritedGroupMembers() {
    if (!this._group || !this._group?.inheritMembers) return;

    const { data } = await tryExecuteAndNotify(
      this,
      ApprovalGroupService.getApprovalGroupInheritedMembers({
        ids: this._group.inheritMembers,
      })
    );

    // remove existing inherited members
    const explicitMembers = [
      ...(this._group.users?.filter((x) => !x.inherited) ?? []),
    ];
    this.workspaceContext?.set({ users: explicitMembers });

    // remove duplicates - user may be in multiple groups
    let users: Array<User2UserGroupModel> = Array.from(new Set(data));

    // only keep users not explicitly assigned
    users = users.filter(
      (u) => !this._group!.users?.some((x) => x.userId === u.userId)
    );

    // only keep those we have room for - explicit takes priority, then topped up from inherited
    if (users.length && this.license?.maxGroups !== -1) {
      const capacity =
        this.license!.maxGroups - (this._group.users?.length ?? 0);
      users = capacity ? users.slice(0, capacity - 1) : [];
    }

    this.workspaceContext?.set({
      users: [...(this._group.users ?? []), ...users],
    });
  }

  // #removeUser(userId: string) {
  //   this.workspaceContext?.removeUser(userId);

  //   if (this.inheritedGroups.length) {
  //     this.#getInheritedGroupMembers();
  //   }
  // }

  // #removeInherited(groupId: string) {
  //   const index = this.inheritedGroups.findIndex((g) => g.id === groupId);
  //   this.inheritedGroups.splice(index, 1);

  //   const groupIds = this._group?.inheritMembers
  //     ?.split(",")
  //     .filter((x) => x !== groupId);

  //   this.workspaceContext?.set({ inheritMembers: groupIds?.join(",") });

  //   this.#getInheritedGroupMembers();
  // }

  // TODO => wny no users?
  #onUserSelectionChange(e: Event) {
    const selection = (e.target as any).selection;

    selection.forEach((user) => {
      // if user is in group already, make sure they're not inherited
      // then add the new user if not in the group
      const existing = this._group?.users?.find(
        (u) => u.userId === user.unique
      );
      if (existing && existing.inherited) {
        existing.inherited = false;
      } else if (!existing) {
        const newUser: User2UserGroupModel = {
          userId: user.unique,
          name: user.name,
          groupId: this._group!.unique,
          inherited: false,
          isActive: true,
        };
        const users = [...(this._group?.users ?? []), newUser];
        this.workspaceContext?.set({ users });
      }
    });
  }

  async #onGroupSelectionChange(e: Event) {
    const selection = (e.target as any).selection;

    this.workspaceContext?.set({ inheritMembers: selection.join(",") });
    this.inheritedGroups = this.allGroups.filter((x) =>
      selection.includes(x.id!)
    );

    this.#getInheritedGroupMembers();
  }

  render() {
    return html`<div class="flex">
      <uui-box .headline=${this.localize.term("workflow_membership")}>
        <umb-user-input @change=${this.#onUserSelectionChange}></umb-user-input>
      </uui-box>
      <uui-box .headline=${this.localize.term("workflow_inheritedMembership")}>
        <umb-user-group-input
          @change=${this.#onGroupSelectionChange}
        ></umb-user-group-input>
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
