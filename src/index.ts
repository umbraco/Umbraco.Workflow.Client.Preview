import {
  UmbExtensionsApiInitializer,
  type UmbEntryPointOnInit,
} from "@umbraco-cms/backoffice/extension-api";
import { UMB_AUTH_CONTEXT } from "@umbraco-cms/backoffice/auth";
import { manifests } from "./manifests.js";
// eslint-disable-next-line local-rules/ensure-relative-import-use-js-extension
import styles from "./core/css/workflow.css?inline";
import { OpenAPI } from "@umbraco-workflow/generated";
import {
  WORKFLOW_CONTEXT,
  WORKFLOW_SIGNALR_CONTEXT,
  WorkflowContext,
  WorkflowSignalRContext,
} from "@umbraco-workflow/context";


document.head.insertAdjacentHTML("beforeend", `<style>${styles}</style>`);

export * from "./approval-group/index.js";
export * from "./settings/index.js";
export * from "./editor-view/index.js";

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
    WORKFLOW_SIGNALR_CONTEXT,
    new WorkflowSignalRContext(host)
  );
};
