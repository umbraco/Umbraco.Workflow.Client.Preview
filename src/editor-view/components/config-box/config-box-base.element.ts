import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import {
  LitElement,
  css,
  html,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import {
  type WorkflowState,
  WORKFLOW_MANAGER_CONTEXT,
} from "@umbraco-workflow/context";
import type { PermissionType } from "@umbraco-workflow/enums";
import type { NodePermissionsResponseModel } from "@umbraco-workflow/generated";

export class WorkflowConfigBoxBase extends UmbElementMixin(LitElement) {
  workflowManagerContext?: typeof WORKFLOW_MANAGER_CONTEXT.TYPE;
  workflowState?: WorkflowState;

  @state()
  permissions!: NodePermissionsResponseModel;

  variant?: string;

  constructor() {
    super();

    this.consumeContext(WORKFLOW_MANAGER_CONTEXT, (instance) => {
      if (!instance) return;

      this.workflowManagerContext = instance;
      this.variant =
        this.workflowManagerContext?.workspaceContext
          ?.getData()
          ?.variants?.at(0)?.culture ?? "en-us";

      this.#observeWorkflowState();
      this.#observePermissions();
    });
  }

  #observePermissions() {
    this.observe(this.workflowManagerContext!.permissions, (instance) => {
      if (!instance) return;
      this.permissions = instance;
    });
  }

  #observeWorkflowState() {
    this.observe(this.workflowManagerContext!.state, (instance) => {
      this.workflowState = instance;
    });
  }

  renderActiveBadge(activeType: PermissionType) {
    if (this.activeType !== activeType) return null;

    return html`<uui-badge look="outline" color="positive">
      ${this.localize.term("workflow_active")}
    </uui-badge>`;
  }

  hasLength(arr?: Array<any>) {
    return (arr ?? []).length > 0;
  }

  get activeType(): PermissionType | undefined {
    return this.workflowManagerContext?.getActivePermissionType();
  }

  static styles = [
    css`
      :host {
        display: block;
        position: relative;
      }

      uui-badge {
        text-transform: uppercase;
      }

      uui-box.active {
        --uui-color-divider-standalone: var(--uui-color-positive);
        border: 1px solid var(--uui-color-divider-standalone);
      }
    `,
  ];
}
