import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { css, html, state } from "@umbraco-cms/backoffice/external/lit";
import { UMB_APP_LANGUAGE_CONTEXT } from "@umbraco-cms/backoffice/language";
import {
  type WorkflowState,
  WORKFLOW_MANAGER_CONTEXT,
} from "@umbraco-workflow/context";
import type { NodePermissionsResponseModel } from "@umbraco-workflow/generated";
import { PermissionType } from "../../../enums.js";

export class WorkflowConfigBoxBaseElement extends UmbLitElement {
  workflowManagerContext?: typeof WORKFLOW_MANAGER_CONTEXT.TYPE;

  @state()
  workflowState?: WorkflowState;

  @state()
  permissions?: NodePermissionsResponseModel;

  @state()
  culture?: string;

  @state()
  defaultCulture?: string;

  @state()
  entityType?: string | null;

  constructor() {
    super();

    this.consumeContext(WORKFLOW_MANAGER_CONTEXT, (context) => {
      if (!context) return;
      this.workflowManagerContext = context;

      this.observe(context.permissions, (permissions) => {
        this.permissions = permissions;
      });

      this.observe(context.state, (state) => {
        this.workflowState = state;
        this.culture = context.getActiveCulture() ?? this.defaultCulture;
        this.entityType = context.getEntityType();
      });
    });

    this.consumeContext(UMB_APP_LANGUAGE_CONTEXT, (context) => {
      this.observe(context?.appDefaultLanguage, (defaultLanguage) => {
        if (!defaultLanguage) return;
        this.defaultCulture = defaultLanguage.unique;
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
