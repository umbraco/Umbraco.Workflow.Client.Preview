/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UserGroupPermissionsModel } from './UserGroupPermissionsModel';

export type NodePermissionsResponseModel = {
    nodeId: number;
    node: Array<UserGroupPermissionsModel>;
    contentType: Array<UserGroupPermissionsModel>;
    inherited: Array<UserGroupPermissionsModel>;
    new: Array<UserGroupPermissionsModel>;
    excluded: boolean;
};
