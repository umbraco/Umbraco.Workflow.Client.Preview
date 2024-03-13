/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HistoryCleanupConfigModel } from './HistoryCleanupConfigModel';

export type HistoryCleanupModel = {
    enableCleanup: boolean;
    keepHistoryForDays: number;
    statusesToDelete: Record<string, boolean>;
    cleanupRules: Record<string, HistoryCleanupConfigModel>;
};
