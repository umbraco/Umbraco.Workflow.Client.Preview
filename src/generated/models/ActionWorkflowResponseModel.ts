/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { WorkflowStatusModel } from './WorkflowStatusModel';
import type { WorkflowTaskModel } from './WorkflowTaskModel';

export type ActionWorkflowResponseModel = {
    workflowStatus: Array<WorkflowStatusModel>;
    activeWorkflows: Array<WorkflowTaskModel>;
};
