/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UserGroupBaseModel } from './UserGroupBaseModel';
import type { UserGroupModel } from './UserGroupModel';
import type { UserSlimModel } from './UserSlimModel';

export type ContentReviewsDetailedConfigModel = {
    id: number;
    documentKey?: string | null;
    name: string;
    documentTypeKey?: string | null;
    excluded: boolean;
    expired: boolean;
    period: number;
    variant: string;
    variantName: string;
    groups: Array<(UserGroupBaseModel | UserGroupModel)>;
    groupIds: string;
    dueOn?: string | null;
    reviewedOn?: string | null;
    reviewedBy?: UserSlimModel | null;
    readonly inherited: boolean;
    inheritedFrom: string;
    inheritedType: string;
    icon: string;
    responsibleUsers: Array<string>;
    isDefaultVariant: boolean;
    externalReviewers?: string | null;
};
