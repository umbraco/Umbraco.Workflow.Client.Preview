/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type HistoryCleanupConfigModel = {
    enableCleanup: boolean;
    keepHistoryForDays?: number | null;
    statusesToDelete: Record<string, boolean>;
    isNodeConfig: boolean;
    editable: boolean;
    entityKey: string;
    entityName?: string | null;
};
