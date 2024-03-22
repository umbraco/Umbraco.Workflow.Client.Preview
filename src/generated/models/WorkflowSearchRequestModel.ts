/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { WorkflowFilterModel } from './WorkflowFilterModel';

export type WorkflowSearchRequestModel = {
    userId?: string | null;
    groupId?: string | null;
    skip?: number | null;
    take: number;
    variant?: string | null;
    filters: Record<string, WorkflowFilterModel>;
    sortBy: string;
    sortDirection: string;
};
