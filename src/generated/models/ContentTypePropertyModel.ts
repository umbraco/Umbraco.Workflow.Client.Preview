/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PropertyDetailModel } from './PropertyDetailModel';
import type { PropertyModel } from './PropertyModel';
import type { UserGroupPermissionsModel } from './UserGroupPermissionsModel';

export type ContentTypePropertyModel = {
    name?: string | null;
    alias?: string | null;
    id: number;
    key: string;
    varies: boolean;
    icon: string;
    properties: Array<(PropertyModel | PropertyDetailModel)>;
    permissions: Array<UserGroupPermissionsModel>;
};
