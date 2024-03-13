/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ActiveTasksModel } from './ActiveTasksModel';
import type { ContentReviewsNodeQueryResponseModel } from './ContentReviewsNodeQueryResponseModel';
import type { NodePermissionsResponseModel } from './NodePermissionsResponseModel';
import type { WorkflowSettingsBaseModel } from './WorkflowSettingsBaseModel';
import type { WorkflowSettingsModel } from './WorkflowSettingsModel';

export type WorkflowScaffoldResponseModel = {
    settings?: (WorkflowSettingsBaseModel | WorkflowSettingsModel) | null;
    config?: NodePermissionsResponseModel | null;
    review?: ContentReviewsNodeQueryResponseModel | null;
    tasks?: ActiveTasksModel | null;
    activeVariants: Array<string>;
};
