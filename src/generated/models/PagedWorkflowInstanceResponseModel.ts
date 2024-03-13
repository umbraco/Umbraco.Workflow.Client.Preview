/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { WorkflowInstanceResponseModel } from './WorkflowInstanceResponseModel';

export type PagedWorkflowInstanceResponseModel = {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    items: Array<WorkflowInstanceResponseModel>;
    defaultCulture: string;
};
