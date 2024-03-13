/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { LanguageModel } from './LanguageModel';

export type GlobalVariablesResponseModel = {
    defaultCulture?: string | null;
    defaultCultureName?: string | null;
    currentUserLocale?: string | null;
    currentUserIsAdmin: boolean;
    currentUserUnique?: string | null;
    availableLanguages: Array<LanguageModel>;
    historyCleanupEnabled: boolean;
    configureApprovalThreshold: boolean;
    defaultApprovalThreshold: number;
    mandatoryComments: boolean;
};
