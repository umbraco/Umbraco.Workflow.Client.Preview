/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { InstanceDetailModel } from './InstanceDetailModel';
import type { NodeSlimModel } from './NodeSlimModel';
import type { UserGroupModel } from './UserGroupModel';

export type WorkflowTaskModel = {
    actionedByAdmin?: boolean | null;
    completedOn?: string | null;
    requestedOn: string;
    actionedByUserId?: string | null;
    assignTo?: string | null;
    groupId?: string | null;
    approvedByIds: Array<string>;
    instance?: InstanceDetailModel | null;
    currentStep: number;
    id: number;
    typeId: number;
    status?: number | null;
    node?: NodeSlimModel | null;
    backofficeUrl?: string | null;
    comment?: string | null;
    completedBy?: string | null;
    groupName?: string | null;
    offlineApprovalUrl?: string | null;
    statusName?: string | null;
    type?: string | null;
    typeDescription?: string | null;
    userGroup?: UserGroupModel | null;
};
