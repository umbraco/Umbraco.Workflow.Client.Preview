import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import { LitElement } from "@umbraco-cms/backoffice/external/lit";
import { WORKFLOW_SETTINGS_WORKSPACE_CONTEXT } from "../workspace/settings-workspace.context-token.js";
import type { GeneralSettingsModel } from "@umbraco-workflow/generated";

export abstract class WorkflowSettingsElementBase extends UmbElementMixin(
  LitElement
) {
  protected workspaceContext?: typeof WORKFLOW_SETTINGS_WORKSPACE_CONTEXT.TYPE;
  protected generalSettings?: GeneralSettingsModel;

  readonly #configureApprovalThreshold = "configureApprovalThreshold";
  readonly #approvalThreshold = "approvalThreshold";

  constructor() {
    super();

    this.consumeContext(WORKFLOW_SETTINGS_WORKSPACE_CONTEXT, (instance) => {
      this.workspaceContext = instance;

      this.observe(this.workspaceContext.generalSettings, (settings) => {
        this.generalSettings = settings;
        this.init();
      });
    });
  }

  abstract init(): void;

  configureApprovalThreshold() {
    return (
      <boolean>(
        this.generalSettings?.properties?.find(
          (x) => x.alias === this.#configureApprovalThreshold
        )?.value
      ) ?? false
    );
  }

  defaultApprovalThreshold() {
    const prop = this.generalSettings?.properties?.find(
      (x) => x.alias === this.#approvalThreshold
    );

    const value = (
      (prop?.config.find((c) => c.alias === "items")?.value as Array<any>) ?? []
    ).indexOf(prop?.value);
    return value;
  }
}
