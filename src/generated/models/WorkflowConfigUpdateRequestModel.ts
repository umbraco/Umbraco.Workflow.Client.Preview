/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UserGroupPermissionsModel } from './UserGroupPermissionsModel';

export type WorkflowConfigUpdateRequestModel = {
    id: number;
    key?: string | null;
    variant: string;
    permissions: Array<UserGroupPermissionsModel>;
};
