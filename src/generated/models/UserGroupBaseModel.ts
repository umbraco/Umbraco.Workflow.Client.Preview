/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { User2UserGroupModel } from './User2UserGroupModel';

export type UserGroupBaseModel = {
    groupId: number;
    key: string;
    name: string;
    groupEmail?: string | null;
    description?: string | null;
    icon?: string | null;
    groupLanguage?: string | null;
    users: Array<User2UserGroupModel>;
};
