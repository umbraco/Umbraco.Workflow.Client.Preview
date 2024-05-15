import {
  css,
  html,
  customElement,
  property,
  when,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UUIFormControlMixin } from "@umbraco-cms/backoffice/external/uui";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { splitStringToArray } from "@umbraco-cms/backoffice/utils";
import { partialUpdateFrozenArray } from "@umbraco-cms/backoffice/observable-api";
import { UmbSorterController } from "@umbraco-cms/backoffice/sorter";
import type { WorkflowRefGroupPermissionElement } from "../refs/ref-group-permissions.element.js";
import { WorkflowApprovalGroupPickerContext } from "./approval-group-input.context.js";
import type {
  UserGroupBaseModel,
  UserGroupPermissionsModel,
} from "@umbraco-workflow/generated";

export interface ApprovalGroupInputConfig {
  basic?: boolean;
  multiple: boolean;
  contentType?: string;
  document?: string;
  remove?: boolean;
  defaultThreshold?: number;
  configureThreshold?: boolean;
  additionalData?: Record<string, any>;
}

const elementName = "workflow-approval-group-input";

@customElement(elementName)
export class WorkflowApprovalGroupInputElement extends UUIFormControlMixin(
  UmbLitElement,
  ""
) {
  @property({ type: Object })
  config: Partial<ApprovalGroupInputConfig> = {
    basic: false,
    multiple: true,
    remove: false,
    configureThreshold: false,
    defaultThreshold: 0,
    additionalData: {},
  };

  public set selection(uniques: Array<string>) {
    this.#pickerContext.setSelection(uniques);
    this.#sorter.setModel(uniques);
  }

  @state()
  public get selection(): Array<string> {
    return this.#pickerContext.getSelection();
  }

  @property()
  public set value(uniques: string) {
    this.selection = splitStringToArray(uniques);
  }
  public get value(): string {
    return this.selection.join(",");
  }

  #selectedPermissions: Array<UserGroupPermissionsModel> = [];

  @property({ type: Array })
  public set selectedPermissions(value: Array<UserGroupPermissionsModel>) {
    this.selection = value.map((x) => x.groupKey);
    this.#selectedPermissions = value;
  }

  get selectedPermissions() {
    return this.#selectedPermissions;
  }

  public items: Array<UserGroupBaseModel> = [];

  #pickerContext: WorkflowApprovalGroupPickerContext;

  #sorter = new UmbSorterController<string>(this, {
    getUniqueOfElement: (element) => {
      return element.id;
    },
    getUniqueOfModel: (modelEntry) => {
      return modelEntry;
    },
    identifier: "Workflow.SorterIdentifier.InputApprovalGroup",
    itemSelector: "workflow-ref-group-permission",
    containerSelector: "uui-ref-list",
    onChange: ({ model }) => {
      this.selection = model;
      this.#mapSelectedPermissions();
    },
  });

  constructor() {
    super();

    // TODO => how to set multiple/single?
    this.#pickerContext = new WorkflowApprovalGroupPickerContext(
      this,
      this.config.multiple
    );

    this.observe(
      this.#pickerContext.selection,
      (selection) =>
        (this.value = this.config.multiple
          ? selection.join(",")
          : selection.at(0) ?? ""),
      "_observeSelection"
    );
    this.observe(
      this.#pickerContext.selectedItems,
      (selectedItems) => {
        this.items = this.config.multiple
          ? selectedItems
          : selectedItems.slice(0, 1);
        this.#mapSelectedPermissions();
        this.requestUpdate("items");
      },
      "_observeItems"
    );
  }

  protected getFormElement() {
    return undefined;
  }

  /**
   * Merge selected into the provided value
   * If the selected item is already in the selection at the same index, ignore it
   */
  #mapSelectedPermissions() {
    const mapped: Array<UserGroupPermissionsModel & { icon?: string }> = [];

    this.items?.forEach((item) => {
      // TODO => make this work with repeated groups, maybe?
      const existing = this.selectedPermissions.find(
        (x) => x.groupKey === item.unique
      );

      mapped.push({
        icon: item.icon ?? undefined,
        nodeKey: this.config.document,
        contentTypeKey: this.config.contentType,
        groupKey: item.unique,
        approvalThreshold:
          existing?.approvalThreshold ?? this.config.defaultThreshold ?? 0,
        permission: 0,
        id: 0,
        variant: "",
        nodeId: 0,
        contentTypeId: 0,
        groupId: 0,
        groupName: item.name,
        ...this.config.additionalData,
      });
    });

    // must set permission number in a new loop, as we skip items in the first iteration
    // so the index will not be the correct value
    mapped.forEach((p, idx) => (p.permission = idx));
    this.selectedPermissions = [...mapped];

    this.dispatchEvent(new CustomEvent("updated"));
  }

  #updateApprovalThreshold(e: CustomEvent) {
    const target = e.target as WorkflowRefGroupPermissionElement;

    this.selectedPermissions = partialUpdateFrozenArray(
      this.selectedPermissions,
      {
        ...target.value,
      },
      (x) => x.groupKey === target.value?.groupKey
    );

    this.dispatchEvent(new CustomEvent("change"));
  }

  render() {
    return html`
      <uui-ref-list
        >${this.selectedPermissions?.map((item) =>
          this._renderPermissionItem(item)
        )}</uui-ref-list
      >
      ${when(
        (this.config.multiple === false && this.selection.length === 0) ||
          this.config.multiple,
        () => html` <uui-button
          id="btn-add"
          look="placeholder"
          @click=${() => this.#pickerContext.openPicker()}
          label=${this.localize.term("general_choose")}
        ></uui-button>`
      )}
    `;
  }

  private _renderPermissionItem(
    item: UserGroupPermissionsModel & { icon?: string }
  ) {
    return html` <workflow-ref-group-permission
      id=${item.groupKey}
      .value=${item}
      .config=${{
        configureThreshold: this.config.configureThreshold,
        defaultThreshold: this.config.defaultThreshold,
        basic: this.config.basic,
      }}
      @approvalThresholdChange=${this.#updateApprovalThreshold}
    >
      <span slot="icon"
        ><uui-icon name=${`icon-${item.icon ?? "users"}`}></uui-icon
      ></span>
      <uui-action-bar slot="actions">
        ${when(
          this.config.remove,
          () => html` <uui-button
            @click=${() => this.#pickerContext.requestRemoveItem(item.groupKey)}
            label=${this.localize.term("general_remove")}
          ></uui-button>`
        )}
      </uui-action-bar>
    </workflow-ref-group-permission>`;
  }

  static styles = [
    css`
      #btn-add {
        width: 100%;
      }
    `,
  ];
}

export default WorkflowApprovalGroupInputElement;

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowApprovalGroupInputElement;
  }
}
