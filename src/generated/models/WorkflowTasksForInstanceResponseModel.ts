/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { WorkflowTaskCollectionModel } from './WorkflowTaskCollectionModel';

export type WorkflowTasksForInstanceResponseModel = {
    taskCollection: Array<WorkflowTaskCollectionModel>;
    totalSteps: number;
    currentStep: number;
};
