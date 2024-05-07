import {
  UmbExtensionsApiInitializer,
  type UmbEntryPointOnInit,
} from "@umbraco-cms/backoffice/extension-api";
import type { ManifestTypes } from "@umbraco-cms/backoffice/extension-registry";
import { UMB_AUTH_CONTEXT } from "@umbraco-cms/backoffice/auth";
import { manifests as dashboardManifests } from "./dashboards/manifests.js";
import { manifests as sectionManifests } from "./section/section.manifests.js";
import { manifests as workspaceEditorViewManifests } from "./editor-view/manifests.js";
import { manifests as modalManifests } from "./core/modal/manifests.js";
import { manifests as localizationManifests } from "./lang/manifests.js";

// eslint-disable-next-line local-rules/ensure-relative-import-use-js-extension
import styles from "./css/workflow.css?inline";
import { OpenAPI } from "@umbraco-workflow/generated";
import {
  WORKFLOW_FILTERPICKER_CONTEXT,
  WORKFLOW_CONTEXT,
  WorkflowFilterPickerContext,
  WorkflowContext,
} from "@umbraco-workflow/context";

document.head.insertAdjacentHTML("beforeend", `<style>${styles}</style>`);

export * from "./components/index.js";
export * from "./dashboards/index.js";
export * from "./editor-view/index.js";

const manifests: Array<ManifestTypes> = [
  ...dashboardManifests,
  ...sectionManifests,
  ...workspaceEditorViewManifests,
  ...modalManifests,
  ...localizationManifests,
];

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
