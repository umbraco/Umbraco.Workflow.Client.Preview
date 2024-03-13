/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { WorkflowTypeModel } from './WorkflowTypeModel';

export type InitiateWorkflowRequestModel = {
    entityId: string;
    comment: string;
    publish: boolean;
    variant: Array<string>;
    releaseDate?: string | null;
    expireDate?: string | null;
    attachmentId?: number | null;
    variantToInitiate: string;
    userId?: string | null;
    type: WorkflowTypeModel;
};
