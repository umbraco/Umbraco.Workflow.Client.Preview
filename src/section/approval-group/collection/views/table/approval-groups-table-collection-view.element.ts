import type {
  UmbTableColumn,
  UmbTableConfig,
  UmbTableItem,
} from "@umbraco-cms/backoffice/components";
import {
  LitElement,
  css,
  customElement,
  html,
  state,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import { UMB_DEFAULT_COLLECTION_CONTEXT } from "@umbraco-cms/backoffice/collection";
import type { UmbDefaultCollectionContext } from "@umbraco-cms/backoffice/collection";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import type { WorkflowApprovalGroupCollectionModel } from "../../types.js";

import "./elements/approval-groups-table-name-column-layout.element.js";
import "./elements/approval-groups-table-membership-column-layout.element.js";
import "./elements/approval-groups-table-permissions-column-layout.element.js";
import "./elements/approval-groups-table-email-column-layout.element.js";
import "./elements/approval-groups-table-entity-actions-column-layout.element.js";

const elementName = "approval-groups-table";

@customElement(elementName)
export class ApprovalGroupsTableElement extends UmbElementMixin(LitElement) {
  #collectionContext?: UmbDefaultCollectionContext<WorkflowApprovalGroupCollectionModel>;

  @state()
  private _tableConfig: UmbTableConfig = {
    allowSelection: false,
  };

  @state()
  private _tableColumns: Array<UmbTableColumn> = [
    {
      name: this.localize.term("general_name"),
      alias: "groupName",
      elementName: "approval-groups-table-name-column-layout",
    },
    {
      name: this.localize.term("workflow_membership"),
      alias: "membership",
      elementName: "approval-groups-table-membership-column-layout",
    },
    {
      name: this.localize.term("workflow_permissions"),
      alias: "permissions",
      elementName: "approval-groups-table-permissions-column-layout",
    },
    {
      name: this.localize.term("workflow_emailGroup"),
      alias: "emailGroup",
      elementName: "approval-groups-table-email-column-layout",
    },
    {
      name: "",
      alias: "entityActions",
      elementName: "approval-groups-table-entity-actions-column-layout",
    },
  ];

  @state()
  private _tableItems: Array<UmbTableItem> = [];

  constructor() {
    super();

    this.consumeContext(UMB_DEFAULT_COLLECTION_CONTEXT, (instance) => {
      this.#collectionContext = instance;
      this.#observeCollectionItems();
    });
  }

  async #observeCollectionItems() {
    if (!this.#collectionContext) return;

    this.observe(
      this.#collectionContext.items,
      (collectionItems) => {
        this.#createTableItems(collectionItems);
      },
      "workflowApprovalGroupsCollectionItemsObserver"
    );
  }

  #createTableItems(result: Array<WorkflowApprovalGroupCollectionModel>) {
    this._tableItems = result.map(
      (userGroup: WorkflowApprovalGroupCollectionModel) => {
        return {
          id: userGroup.unique,
          icon: userGroup.icon,
          data: [
            {
              columnAlias: "groupName",
              value: {
                name: userGroup.name,
                key: userGroup.unique,
              },
            },
            {
              columnAlias: "membership",
              value: {
                users: userGroup.users,
              },
            },
            {
              columnAlias: "permissions",
              value: {
                permissions: userGroup.permissions,
                languageCount: userGroup.languageCount,
              },
            },
            {
              columnAlias: "emailGroup",
              value: {
                groupEmail: userGroup.groupEmail,
                users: userGroup.users,
              },
            },
            {
              columnAlias: "entityActions",
              value: userGroup,
            },
          ],
        };
      }
    );
  }

  render() {
    return when(
      this._tableItems.length,
      () => html`
        <umb-table
          .config=${this._tableConfig}
          .columns=${this._tableColumns}
          .items=${this._tableItems}
        ></umb-table>
      `,
      () => html`<div class="flex">
        ${this.localize.term("content_noItemsToShow")}
      </div>`
    );
  }

  static styles = [
    css`
      :host {
        display: flex;
        flex-direction: column;
      }

      .flex {
        display: flex;
        justify-content: center;
      }
    `,
  ];
}

export default ApprovalGroupsTableElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: ApprovalGroupsTableElement;
  }
}
