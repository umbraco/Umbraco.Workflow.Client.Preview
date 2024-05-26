import { UmbContextToken } from "@umbraco-cms/backoffice/context-api";
import type WorkflowSignalRContext from "../context/workflow-signalr.context.js";

export const WORKFLOW_SIGNALR_CONTEXT =
  new UmbContextToken<WorkflowSignalRContext>("WorkflowSignalRContext");
