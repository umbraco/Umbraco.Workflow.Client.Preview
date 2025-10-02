import { UmbContextBase } from "@umbraco-cms/backoffice/class-api";
import { tryExecute } from "@umbraco-cms/backoffice/resources";
import type { UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { umbExtensionsRegistry } from "@umbraco-cms/backoffice/extension-registry";
import { UmbObjectState } from "@umbraco-cms/backoffice/observable-api";
import { WORKFLOW_CONTEXT } from "../token/workflow.context-token.js";
import {
  ServerInformationService,
  type WorkflowInformationResponseModel,
} from "@umbraco-workflow/generated";

export class WorkflowContext extends UmbContextBase {
  #workflowConfiguration = new UmbObjectState<WorkflowInformationResponseModel | undefined>(undefined);
  hubUrl = this.#workflowConfiguration.asObservablePart(x => x?.hubUrl);

  readonly #featureFlags = [
    "ReleaseSets",
  ];

  constructor(host: UmbControllerHost) {
    super(host, WORKFLOW_CONTEXT);
    this.#getGlobals();
  }

  getVariables() {
    return this.#workflowConfiguration?.getValue()?.globalVariables;
  }

  getLicense() {
    return this.#workflowConfiguration?.getValue()?.license;
  }

  getHubUrl() {
    return this.#workflowConfiguration?.getValue()?.hubUrl;
  }

  getVersion() {
    return this.#workflowConfiguration?.getValue()?.version;
  }

  async #getGlobals() {
    const { data } = await tryExecute(
      this._host,
      ServerInformationService.getInformation()
    );

    this.#workflowConfiguration.setValue(data);
    const isLicensed = this.getLicense()?.isLicensed ?? false;

    this.#featureFlags.forEach((flag) => {
      const isDisabled =
        data?.featureFlags.includes(flag) === false;
      if (isDisabled || !isLicensed) {
        umbExtensionsRegistry.unregister(`Workflow.Bundle.${flag}`);
      }
    });
  }
}

export default WorkflowContext;
