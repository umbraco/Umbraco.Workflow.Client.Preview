import { UMB_DOCUMENT_WORKSPACE_CONTEXT } from "@umbraco-cms/backoffice/document";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import {
  LitElement,
  css,
  html,
  state,
} from "@umbraco-cms/backoffice/external/lit";
import { observeMultiple } from "@umbraco-cms/backoffice/observable-api";
import {
  type WorkflowState,
  WORKFLOW_MANAGER_CONTEXT,
  WORKFLOW_CONTEXT,
} from "@umbraco-workflow/context";
import type { PermissionType } from "@umbraco-workflow/core";
import type {
  GlobalVariablesModel,
  NodePermissionsResponseModel,
} from "@umbraco-workflow/generated";

export class WorkflowConfigBoxBase extends UmbElementMixin(LitElement) {
  workflowManagerContext?: typeof WORKFLOW_MANAGER_CONTEXT.TYPE;

  @state()
  workflowState?: WorkflowState;

  @state()
  globalVariables?: GlobalVariablesModel;

  @state()
  permissions?: NodePermissionsResponseModel;

  @state()
  variant?: string;

  constructor() {
    super();

    this.consumeContext(WORKFLOW_MANAGER_CONTEXT, (context) => {
      if (!context) return;
      this.workflowManagerContext = context;
      this.observe(
        observeMultiple([context.permissions, context.state]),
        ([permissions, state]) => {
          this.permissions = permissions;
          this.workflowState = state;
        }
      );
    });

    // TODO => solve for active variant
    this.consumeContext(UMB_DOCUMENT_WORKSPACE_CONTEXT, (context) => {
      this.variant = context?.getData()?.variants?.at(0)?.culture ?? "en-us";
    });

    this.consumeContext(WORKFLOW_CONTEXT, (context) => {
      if (!context) return;
      this.observe(context.globalVariables, (globalVariables) => {
        this.globalVariables = globalVariables;
      });
    });
  }

  renderActiveBadge(...activeTypes: Array<PermissionType>) {
    if (!this.activeType || !activeTypes.includes(this.activeType)) return null;

    return html`<uui-badge look="outline" color="positive">
      ${this.localize.term("workflow_active")}
    </uui-badge>`;
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
