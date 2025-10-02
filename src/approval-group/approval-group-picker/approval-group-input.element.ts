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
import { partialUpdateFrozenArray } from "@umbraco-cms/backoffice/observable-api";
import { UmbSorterController } from "@umbraco-cms/backoffice/sorter";
import { firstValueFrom } from "@umbraco-cms/backoffice/external/rxjs";
import type { WorkflowRefGroupPermissionElement } from "../refs/ref-group-permission.element.js";
import { WORKFLOW_APPROVALGROUP_ENTITY_TYPE } from "../constants.js";
import { WorkflowApprovalGroupPickerContext } from "./approval-group-input.context.js";
import type { ApprovalGroupInputConfig } from "./entities.js";
import {
  type ApprovalGroupDetailPermissionConfigModel,
  ApprovalGroupItemResponseModel,
  ApprovalThresholdModel,
} from "@umbraco-workflow/generated";
import { WorkflowWorkspaceModalRouterController } from "@umbraco-workflow/core";
import { UmbChangeEvent } from "@umbraco-cms/backoffice/event";

const elementName = "workflow-approval-group-input";

@customElement(elementName)
export class WorkflowApprovalGroupInputElement extends UUIFormControlMixin(
  UmbLitElement,
  ""
) {
  #pickerContext = new WorkflowApprovalGroupPickerContext(this);
  #modalRouter = new WorkflowWorkspaceModalRouterController(
    this,
    WORKFLOW_APPROVALGROUP_ENTITY_TYPE
  );

  @state()
  _editGroupPath = "";

  @property({ type: Boolean, reflect: true })
  readonly = false;

  @property({ type: Object })
  config: Partial<ApprovalGroupInputConfig> = {
    multiple: true,
    edit: false,
    remove: false,
    basic: false,
    configureThreshold: false,
    defaultThreshold: ApprovalThresholdModel.ONE,
    additionalData: {},
  };

  public set selection(uniques: Array<string>) {
    this.#pickerContext.setSelection(uniques);
    this.#sorter.setModel(uniques);
  }

  public get selection(): Array<string> | undefined {
    return this.#pickerContext.getSelection();
  }

  @state()
  private _selectedPermissions: Array<ApprovalGroupDetailPermissionConfigModel> =
    [];

  @property({ type: Array })
  public set selectedPermissions(
    permissions: Array<ApprovalGroupDetailPermissionConfigModel>
  ) {
    this._selectedPermissions = permissions;
    this.selection = permissions.map((p) => p.groupUnique);
  }

  public get selectedPermissions(): Array<ApprovalGroupDetailPermissionConfigModel> {
    return this._selectedPermissions;
  }

  #sorter = new UmbSorterController<string>(this, {
    getUniqueOfElement: (element) => element.id,
    getUniqueOfModel: (modelEntry) => modelEntry,
    identifier: "Workflow.SorterIdentifier.InputApprovalGroup",
    itemSelector: "workflow-ref-group-permission",
    containerSelector: "uui-ref-list",
    onChange: ({ model }) => {
      this.selection = model;
      this._selectedPermissions = this._selectedPermissions.map((p) => ({
        ...p,
        permission: model.indexOf(p.groupUnique),
      }));
      this.dispatchEvent(new UmbChangeEvent());
    },
  });

  constructor() {
    super();

    this.observe(
      this.#pickerContext.selectedItems,
      async (selectedItems) => {
        this.#mapSelectedPermissions(selectedItems);
      },
      "_observeSelectedItems"
    );
  }

  async connectedCallback() {
    super.connectedCallback();
    this.#pickerContext.max = this.config.multiple ? Infinity : 1;
    this._editGroupPath = await firstValueFrom(this.#modalRouter.path);
  }

  protected getFormElement() {
    return undefined;
  }

  /**
   * Merge selected into the provided value
   * If the selected item is already in the selection at the same index, ignore it
   */
  #mapSelectedPermissions(items: Array<ApprovalGroupItemResponseModel>) {
    this._selectedPermissions = items
      .map((item, i) => {
        const existing = this.selectedPermissions.find(
          (x) => x.groupUnique === item.unique
        );

        return {
          icon: item.icon,
          groupUnique: item.unique,
          approvalThreshold:
            existing?.approvalThreshold ??
            this.config.defaultThreshold ??
            ApprovalThresholdModel.ONE,
          permission: i,
          name: item.name,
          ...this.config.additionalData,
        };
      });

    this.#sorter.setModel(this._selectedPermissions.map((x) => x.groupUnique));
    this.dispatchEvent(new UmbChangeEvent());
  }

  #updateApprovalThreshold(e: Event) {
    const target = e.target as WorkflowRefGroupPermissionElement;

    this._selectedPermissions = partialUpdateFrozenArray(
      this._selectedPermissions,
      {
        ...target.value,
      },
      (x) => x.groupUnique === target.value?.groupUnique
    );

    this.dispatchEvent(new UmbChangeEvent());
  }

  #renderPermissionItem(item: ApprovalGroupDetailPermissionConfigModel) {
    return html` <workflow-ref-group-permission
      id=${item.groupUnique}
      .value=${item}
      .config=${this.config}
      ?inert=${this.readonly}
      @approvalThresholdChange=${this.#updateApprovalThreshold}
    >
      <umb-icon slot="icon" name=${item.icon ?? "icon-users"}></umb-icon>

      <uui-action-bar slot="actions">
        ${when(
          this.config.edit,
          () => html`<uui-button
            href="${this._editGroupPath}edit/${item.groupUnique}"
            .label=${this.localize.term("general_edit")}
          ></uui-button>`
        )}
        ${when(
          this.config.remove,
          () => html` <uui-button
            @click=${() =>
              this.#pickerContext?.requestRemoveItem(item.groupUnique)}
            label=${this.localize.term("general_remove")}
          ></uui-button>`
        )}
      </uui-action-bar>
    </workflow-ref-group-permission>`;
  }

  render() {
    return html`
      <uui-ref-list
        >${this.selectedPermissions?.map((item) =>
          this.#renderPermissionItem(item)
        )}</uui-ref-list
      >
      ${when(
        !this.selectedPermissions.length && this.config.emptyLabel,
        () =>
          html`<workflow-alert light>${this.config.emptyLabel}</workflow-alert>`
      )}
      ${when(
        ((this.config.multiple === false && this.selection?.length === 0) ||
          this.config.multiple) &&
          !this.readonly,
        () => html` <uui-button
          id="btn-add"
          look="placeholder"
          @click=${() => this.#pickerContext?.openPicker()}
          label=${this.localize.term("general_choose")}
        ></uui-button>`
      )}
    `;
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
