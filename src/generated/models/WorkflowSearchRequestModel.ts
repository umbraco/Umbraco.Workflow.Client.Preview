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
    sortBy: string;
    sortDirection: string;
    filters: Record<string, WorkflowFilterModel>;
    historyOnly: boolean;
    readonly isDescending: boolean;
    readonly orderByClause: string;
};
