import {
  css,
  html,
  customElement,
  property,
  ifDefined,
  nothing,
} from "@umbraco-cms/backoffice/external/lit";
import { UUIFormControlMixin } from "@umbraco-cms/backoffice/external/uui";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { splitStringToArray } from "@umbraco-cms/backoffice/utils";
import { WorkflowApprovalGroupPickerContext } from "./approval-group-input.context.js";
import type { UserGroupBaseModel } from "@umbraco-workflow/generated";

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
  additionalData?;

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
        this.requestUpdate("items");
      },
      "_observeItems"
    );
  }

  protected getFormElement() {
    return undefined;
  }

  render() {
    return html`
      <uui-ref-list
        >${this.items?.map((item) => this._renderItem(item))}</uui-ref-list
      >
      <uui-button
        id="btn-add"
        look="placeholder"
        @click=${() => this.#pickerContext.openPicker()}
        label=${this.localize.term("workflow_addWorkflowGroups")}
      ></uui-button>
    `;
  }

  private _renderItem(item: UserGroupBaseModel) {
    if (!item.unique) return;
    return html`
      <umb-user-group-ref name=${ifDefined(item.name)}>
        ${item.icon
          ? html`<umb-icon
              slot="icon"
              name=${item.icon.startsWith("icon-")
                ? item.icon
                : `icon-${item.icon}`}
            ></umb-icon>`
          : nothing}
        <uui-action-bar slot="actions">
          <uui-button
            @click=${() => this.#pickerContext.requestRemoveItem(item.unique)}
            label=${this.localize.term("general_remove")}
          ></uui-button>
        </uui-action-bar>
      </umb-user-group-ref>
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
