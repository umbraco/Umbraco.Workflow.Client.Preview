import { UmbContextToken } from "@umbraco-cms/backoffice/context-api";
import type { WorkflowAlternatVersionPropertyDatasetContext } from "./altenate-version-property-dataset.context.js";

export const WORKFLOW_ALTERNATEVERSION_PROPERTY_DATASET_CONTEXT =
  new UmbContextToken<WorkflowAlternatVersionPropertyDatasetContext>(
    "WorkflowAlternatVersionPropertyDatasetContext"
  );
