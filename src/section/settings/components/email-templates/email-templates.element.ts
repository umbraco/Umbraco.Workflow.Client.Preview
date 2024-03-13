import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import {
  LitElement,
  customElement,
  html,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { UMB_MODAL_MANAGER_CONTEXT } from "@umbraco-cms/backoffice/modal";
import { WORKFLOW_SETTINGS_WORKSPACE_CONTEXT } from "../../workspace/settings-workspace.context-token.js";
import { WORKFLOW_EMAIL_SENDTO_MODAL } from "../../modal/index.js";
import type {
  ConfigTypeModel,
  WorkflowEmailConfigModel,
} from "@umbraco-workflow/generated";

export type ExtendedWorkflowEmailConfigModel = {
  sendTo: string;
  name: string;
} & WorkflowEmailConfigModel;

const elementName = "workflow-email-templates";

@customElement(elementName)
export class WorkflowEmailTemplatesElement extends UmbElementMixin(LitElement) {
  #workspaceContext?: typeof WORKFLOW_SETTINGS_WORKSPACE_CONTEXT.TYPE;
  #modalManagerContext?: typeof UMB_MODAL_MANAGER_CONTEXT.TYPE;

  @state()
  config: Array<ConfigTypeModel> = [];

  @state()
  value: Array<ExtendedWorkflowEmailConfigModel> = [];

  #sendToStr = this.localize.term("workflow_sendTo");

  constructor() {
    super();

    this.consumeContext(UMB_MODAL_MANAGER_CONTEXT, (instance) => {
      this.#modalManagerContext = instance;
    });

    this.consumeContext(WORKFLOW_SETTINGS_WORKSPACE_CONTEXT, (instance) => {
      if (!instance) return;
      this.#workspaceContext = instance;
      this.#observeValue();
    });
  }

  #observeValue() {
    if (!this.#workspaceContext) return;

    this.observe(this.#workspaceContext.notificationsSettings, (instance) => {
      if (!instance) return;
      this.value = instance?.emailTemplates?.value.map((v) => ({
        ...v,
        sendTo: "",
      }));
      this.config = instance?.emailTemplates?.config;
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
    if (!this.#modalManagerContext) return;

    const modalHandler = this.#modalManagerContext.open(this, 
      WORKFLOW_EMAIL_SENDTO_MODAL,
      {
        data: {
          config: this.config,
          emailType,
        },
      }
    );

    const { selectedIds } = await modalHandler.onSubmit();
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
