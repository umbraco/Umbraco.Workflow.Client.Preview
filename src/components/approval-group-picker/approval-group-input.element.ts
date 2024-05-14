import {
  css,
  html,
  customElement,
  property,
  when,
} from "@umbraco-cms/backoffice/external/lit";
import { UUIFormControlMixin } from "@umbraco-cms/backoffice/external/uui";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { splitStringToArray } from "@umbraco-cms/backoffice/utils";
import type { WorkflowRefGroupPermissionElement } from "../refs/ref-group-permissions.element.js";
import { WorkflowApprovalGroupPickerContext } from "./approval-group-input.context.js";
import type {
  UserGroupBaseModel,
  UserGroupPermissionsModel,
} from "@umbraco-workflow/generated";

export interface ApprovalGroupInputConfig {
  edit?: boolean;
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
  @property()
  contentType?: string;

  @property()
  document?: string;

  @property({ type: Object })
  config: Partial<ApprovalGroupInputConfig> = {
    edit: false,
    remove: false,
    configureThreshold: false,
    defaultThreshold: 0,
    additionalData: {},
  };

  public set selection(ids: Array<string>) {
    this.#pickerContext.setSelection(ids);
  }
  public get selection(): Array<string> {
    return this.#pickerContext.getSelection();
  }

  @property()
  public set value(idsString: string) {
    this.selection = splitStringToArray(idsString);
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

  #pickerContext = new WorkflowApprovalGroupPickerContext(this);

  constructor() {
    super();

    this.observe(
      this.#pickerContext.selection,
      (selection) => (this.value = selection.join(",")),
      "_observeSelection"
    );
    this.observe(
      this.#pickerContext.selectedItems,
      (selectedItems) => {
        this.items = selectedItems;
        this.#mapSelectedPermissions();
        this.requestUpdate("items");
      },
      "_observeItems"
    );
  }

  protected getFormElement() {
    return undefined;
  }

  #edit(item: UserGroupPermissionsModel) {
    alert(item.groupName);
  }

  /**
   * Merge selected into the provided value
   * If the selected item is already in the selection at the same index, ignore it
   */
  #mapSelectedPermissions() {
    const mapped: Array<UserGroupPermissionsModel> = [];

    this.items?.forEach((item) => {
      // TODO => make this work with repeated groups, maybe?
      const existing = this.selectedPermissions.find(x => x.groupKey === item.unique);

      mapped.push({
        nodeKey: this.document,
        contentTypeKey: this.contentType,
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

    this.dispatchEvent(new CustomEvent("change"));
  }

  #updateApprovalThreshold(e: CustomEvent, item: UserGroupPermissionsModel) {
    const target = e.target as WorkflowRefGroupPermissionElement;
    item.approvalThreshold = target.value?.approvalThreshold ?? this.config.defaultThreshold ?? 0;
    this.dispatchEvent(new CustomEvent("change"));
  }

  render() {
    return html`
      <uui-ref-list
        >${this.selectedPermissions?.map((item) =>
          this._renderPermissionItem(item)
        )}</uui-ref-list
      >
      <uui-button
        id="btn-add"
        look="placeholder"
        @click=${() => this.#pickerContext.openPicker()}
        label=${this.localize.term("workflow_addWorkflowGroups")}
      ></uui-button>
    `;
  }

  private _renderPermissionItem(item: UserGroupPermissionsModel) {
    return html` <workflow-ref-group-permission
      .value=${item}
      ?canConfigureApprovalThreshold=${this.config.configureThreshold}
      .defaultApprovalThreshold=${this.config.defaultThreshold}
      @approvalThresholdChange=${(e) => this.#updateApprovalThreshold(e, item)}
      ><uui-action-bar slot="actions">
        ${when(
          this.config.edit,
          () => html` <uui-button
            @click=${() => this.#edit(item)}
            label=${this.localize.term("general_remove")}
          ></uui-button>`
        )}${when(
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
