/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { SettingsPropertyDisplayModel } from './SettingsPropertyDisplayModel';
import type { UserGroupBaseModel } from './UserGroupBaseModel';
import type { UserGroupPermissionsModel } from './UserGroupPermissionsModel';

export type UserGroupModel = (UserGroupBaseModel & {
alias: string;
offlineApproval: boolean;
deleted: boolean;
permissions: Array<UserGroupPermissionsModel>;
readonly usersSummary: string;
inheritMembers: string;
properties: Array<SettingsPropertyDisplayModel>;
availableLanguages: Record<string, string>;
});
