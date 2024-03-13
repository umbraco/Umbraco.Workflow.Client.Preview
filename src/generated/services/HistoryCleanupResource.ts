/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HistoryCleanupConfigModel } from '../models/HistoryCleanupConfigModel';
import type { HistoryCleanupModel } from '../models/HistoryCleanupModel';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class HistoryCleanupResource {

    /**
     * @returns any Success
     * @throws ApiError
     */
    public static getHistoryCleanup({
uniqueId,
contentTypeId,
}: {
uniqueId?: string,
contentTypeId?: string,
}): CancelablePromise<HistoryCleanupModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/workflow/api/history-cleanup',
            query: {
                'uniqueId': uniqueId,
                'contentTypeId': contentTypeId,
            },
            errors: {
                401: `The resource is protected and requires an authentication token`,
            },
        });
    }

    /**
     * @returns string Success
     * @throws ApiError
     */
    public static putHistoryCleanup({
requestBody,
}: {
requestBody?: Record<string, HistoryCleanupConfigModel>,
}): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/umbraco/workflow/api/history-cleanup',
            body: requestBody,
            mediaType: 'application/json',
            responseHeader: 'Umb-Notifications',
            errors: {
                401: `The resource is protected and requires an authentication token`,
            },
        });
    }

}
