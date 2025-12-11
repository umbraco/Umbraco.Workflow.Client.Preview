import {
  UmbExtensionsApiInitializer,
  type UmbEntryPointOnInit,
} from "@umbraco-cms/backoffice/extension-api";
import { UMB_AUTH_CONTEXT } from "@umbraco-cms/backoffice/auth";
import { manifests } from "./manifests.js";
// eslint-disable-next-line local-rules/ensure-relative-import-use-js-extension
import styles from "./core/css/workflow.css?inline";
import { WORKFLOW_PACKAGES } from "./packages.js";
import { WorkflowActionRegistrar } from "@umbraco-workflow/core";
import { client } from "@umbraco-workflow/generated";
import { WORKFLOW_OBJECT_STORE_TYPE_ALIAS } from "@umbraco-workflow/repository";

document.head.insertAdjacentHTML("beforeend", `<style>${styles}</style>`);

export const onInit: UmbEntryPointOnInit = (host, extensionRegistry) => {
  new UmbExtensionsApiInitializer(
    host,
    extensionRegistry,
    WORKFLOW_OBJECT_STORE_TYPE_ALIAS,
    [host]
  );

  new WorkflowActionRegistrar(host);

  extensionRegistry.registerMany(manifests);

  WORKFLOW_PACKAGES.forEach((packageImport) => {
    const module = packageImport;
    extensionRegistry.registerMany(module.extensions);
  });

  host.consumeContext(UMB_AUTH_CONTEXT, async (auth) => {
    const config = auth?.getOpenApiConfiguration();

    client.setConfig({
      baseUrl: config?.base ?? "",
      auth: config?.token ?? undefined,
      credentials: config?.credentials ?? "same-origin",
    });
  });
};
