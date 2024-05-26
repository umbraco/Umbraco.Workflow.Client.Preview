import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import {
  LitElement,
  customElement,
  html,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UMB_MODAL_MANAGER_CONTEXT } from "@umbraco-cms/backoffice/modal";
import { WORKFLOW_SETTINGS_WORKSPACE_CONTEXT } from "../../workspace/settings-workspace.context-token.js";
import type { ExtendedWorkflowEmailConfigModel } from "../../types.js";
import { WORKFLOW_EMAIL_SENDTO_MODAL } from "./index.js";
import type { ConfigTypeModel } from "@umbraco-workflow/generated";

const elementName = "workflow-email-templates";

@customElement(elementName)
export class WorkflowEmailTemplatesElement extends UmbElementMixin(LitElement) {
  #workspaceContext?: typeof WORKFLOW_SETTINGS_WORKSPACE_CONTEXT.TYPE;

  @state()
  config: Array<ConfigTypeModel> = [];

  @state()
  value: Array<ExtendedWorkflowEmailConfigModel> = [];

  #sendToStr = this.localize.term("workflow_sendTo");

  constructor() {
    super();

    this.consumeContext(WORKFLOW_SETTINGS_WORKSPACE_CONTEXT, (context) => {
      if (!context) return;
      this.#workspaceContext = context;
      this.#observeValue();
    });
  }

  #observeValue() {
    if (!this.#workspaceContext) return;

    this.observe(this.#workspaceContext.notificationsSettings, (notificationsSettings) => {
      if (!notificationsSettings) return;
      this.value = (<any>notificationsSettings?.emailTemplates?.value).map((v) => ({
        ...v,
        sendTo: "",
      }));
      this.config = notificationsSettings?.emailTemplates?.config;
      this.#setSendTo();
    });
  }

  #setSendTo() {
    this.value.forEach((v) => this.#localize(v));
  }

  #localize(v: ExtendedWorkflowEmailConfigModel) {
    if (!v.to) return;

    v.name = this.localize.term(
      `workflow_${v.key![0].toLowerCase()}${v.key!.substring(1)}`
    );

    const emailTo = this.config
      .filter((x) => v.to?.includes(x.value as number))
      .map((x) => this.localize.term(`workflow_${x.alias}`))
      .join(", ");

    v.sendTo = `${this.#sendToStr}: ${emailTo}`;
  }

  async #edit(emailType: ExtendedWorkflowEmailConfigModel) {
    const modalContext = await this.getContext(UMB_MODAL_MANAGER_CONTEXT);
    const modalHandler = modalContext.open(this, WORKFLOW_EMAIL_SENDTO_MODAL, {
      data: {
        config: this.config,
        emailType,
      },
    });

    await modalHandler.onSubmit().catch(() => undefined);
    const selectedIds = modalHandler.getValue()?.selectedIds;
    if (!selectedIds) return;

    emailType.to = selectedIds;

    this.#workspaceContext?.setValue(
      this.value,
      "emailTemplates",
      "notificationsSettings"
    );
  }

  render() {
    if (!this.value) return;

    return html` <uui-ref-list>
      ${this.value.map(
        (emailType) =>
          html`<uui-ref-node
            .name=${emailType.name}
            .detail=${emailType.sendTo}
            @open=${() => this.#edit(emailType)}
          >
          </uui-ref-node>`
      )}
    </uui-ref-list>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [elementName]: WorkflowEmailTemplatesElement;
  }
}
