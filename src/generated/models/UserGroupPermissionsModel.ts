/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type UserGroupPermissionsModel = {
    id: number;
    nodeKey?: string | null;
    groupKey: string;
    contentTypeKey?: string | null;
    nodeId: number;
    groupId: number;
    groupName: string;
    contentTypeId: number;
    permission: number;
    condition?: string | null;
    variant: string;
    nodeName?: string | null;
    contentTypeName?: string | null;
    contentTypeAlias?: string | null;
    approvalThreshold?: number | null;
};
