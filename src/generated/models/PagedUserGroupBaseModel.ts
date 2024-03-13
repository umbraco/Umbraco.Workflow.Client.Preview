/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UserGroupBaseModel } from './UserGroupBaseModel';
import type { UserGroupModel } from './UserGroupModel';

export type PagedUserGroupBaseModel = {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    items: Array<(UserGroupBaseModel | UserGroupModel)>;
    defaultCulture: string;
};
