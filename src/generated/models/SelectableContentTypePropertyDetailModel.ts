/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PropertyDetailModel } from './PropertyDetailModel';
import type { UserGroupPermissionsModel } from './UserGroupPermissionsModel';

export type SelectableContentTypePropertyDetailModel = {
    name?: string | null;
    alias?: string | null;
    id: number;
    key: string;
    varies: boolean;
    icon: string;
    properties: Array<PropertyDetailModel>;
    permissions: Array<UserGroupPermissionsModel>;
    selected: boolean;
};
