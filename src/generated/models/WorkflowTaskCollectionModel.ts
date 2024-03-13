/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { WorkflowTaskCollectionItemModel } from './WorkflowTaskCollectionItemModel';

export type WorkflowTaskCollectionModel = {
    groupName?: string | null;
    items: Array<WorkflowTaskCollectionItemModel>;
    status?: number | null;
    actionedByAdmin: boolean;
    approvalCount: number;
    approvalsRequired: number;
    approvalsText?: string | null;
    approvalStep: number;
    future: boolean;
};
