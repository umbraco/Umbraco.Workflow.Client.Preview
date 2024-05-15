import {
  UmbExtensionsApiInitializer,
  type UmbEntryPointOnInit,
} from "@umbraco-cms/backoffice/extension-api";
import { UMB_AUTH_CONTEXT } from "@umbraco-cms/backoffice/auth";
import { manifests } from "./manifests.js";
// eslint-disable-next-line local-rules/ensure-relative-import-use-js-extension
import styles from "./css/workflow.css?inline";
import {
  WorkflowFilterPickerContext,
  WORKFLOW_FILTERPICKER_CONTEXT,
} from "@umbraco-workflow/components";
import { OpenAPI } from "@umbraco-workflow/generated";
import { WORKFLOW_CONTEXT, WorkflowContext } from "@umbraco-workflow/context";

document.head.insertAdjacentHTML("beforeend", `<style>${styles}</style>`);

export * from "./components/index.js";
export * from "./editor-view/index.js";
// TODO => why does this need exporting when other dashboards do not?
export * from "./dashboards/advanced-search/advanced-search.dashboard.element.js";

export const onInit: UmbEntryPointOnInit = (host, extensionRegistry) => {
  new UmbExtensionsApiInitializer(
    host,
    extensionRegistry,
    "workflowObjectStore",
    [host]
  );

  extensionRegistry.registerMany(manifests);

  // Ensure Workflow's OpenAPI implementation uses the correct auth token
  host.consumeContext(UMB_AUTH_CONTEXT, async (auth) => {
    if (!auth) return;

    const umbOpenApi = auth.getOpenApiConfiguration();
    OpenAPI.BASE = umbOpenApi.base;
    OpenAPI.TOKEN = umbOpenApi.token;
    OpenAPI.WITH_CREDENTIALS = umbOpenApi.withCredentials;
    OpenAPI.CREDENTIALS = umbOpenApi.credentials;
  });

  host.provideContext(WORKFLOW_CONTEXT, new WorkflowContext(host));

  host.provideContext(
    WORKFLOW_FILTERPICKER_CONTEXT,
    new WorkflowFilterPickerContext(host)
  );
};
