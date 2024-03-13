/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { InstanceDetailModel } from './InstanceDetailModel';
import type { NodeSlimModel } from './NodeSlimModel';
import type { WorkflowPermissionResponseModel } from './WorkflowPermissionResponseModel';
import type { WorkflowTaskResponseModel } from './WorkflowTaskResponseModel';

export type WorkflowInstanceResponseModel = {
    node?: NodeSlimModel | null;
    instance?: InstanceDetailModel | null;
    permissions: Array<WorkflowPermissionResponseModel>;
    tasks: Array<WorkflowTaskResponseModel>;
};
