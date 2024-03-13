/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContentReviewNodePocoModel } from '../models/ContentReviewNodePocoModel';
import type { ContentReviewsConfigModel } from '../models/ContentReviewsConfigModel';
import type { ContentReviewsNodeQueryResponseModel } from '../models/ContentReviewsNodeQueryResponseModel';
import type { ContentReviewsSaveSettingsModel } from '../models/ContentReviewsSaveSettingsModel';
import type { PagedContentReviewsDetailedConfigModel } from '../models/PagedContentReviewsDetailedConfigModel';
import type { WorkflowFilterModel } from '../models/WorkflowFilterModel';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ContentReviewResource {

    /**
     * @returns any Success
     * @throws ApiError
     */
    public static getContentReviewCheck({
nodeId,
nodeKey,
contentTypeId,
variant,
}: {
nodeId?: number,
nodeKey?: string,
contentTypeId?: number,
variant?: string,
}): CancelablePromise<ContentReviewsNodeQueryResponseModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/workflow/api/content-review/check',
            query: {
                'NodeId': nodeId,
                'NodeKey': nodeKey,
                'ContentTypeId': contentTypeId,
                'Variant': variant,
            },
            errors: {
                400: `Bad Request`,
                401: `The resource is protected and requires an authentication token`,
                500: `Server Error`,
            },
        });
    }

    /**
     * @returns any Success
     * @throws ApiError
     */
    public static getContentReviewConfig(): CancelablePromise<ContentReviewsConfigModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/workflow/api/content-review/config',
            errors: {
                400: `Bad Request`,
                401: `The resource is protected and requires an authentication token`,
                500: `Server Error`,
            },
        });
    }

    /**
     * @returns any Success
     * @throws ApiError
     */
    public static putContentReviewConfig({
requestBody,
}: {
requestBody?: ContentReviewsSaveSettingsModel,
}): CancelablePromise<ContentReviewsConfigModel> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/umbraco/workflow/api/content-review/config',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `The resource is protected and requires an authentication token`,
                500: `Server Error`,
            },
        });
    }

    /**
     * @returns PagedContentReviewsDetailedConfigModel Success
     * @throws ApiError
     */
    public static getContentReviewNodes({
userId,
groupId,
skip,
take,
variant,
sortBy,
sortDirection,
filters,
historyOnly,
isDescending,
orderByClause,
}: {
userId?: string,
groupId?: string,
skip?: number,
take?: number,
variant?: string,
sortBy?: string,
sortDirection?: string,
filters?: Record<string, WorkflowFilterModel>,
historyOnly?: boolean,
isDescending?: boolean,
orderByClause?: string,
}): CancelablePromise<PagedContentReviewsDetailedConfigModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/workflow/api/content-review/nodes',
            query: {
                'UserId': userId,
                'GroupId': groupId,
                'Skip': skip,
                'Take': take,
                'Variant': variant,
                'SortBy': sortBy,
                'SortDirection': sortDirection,
                'Filters': filters,
                'HistoryOnly': historyOnly,
                'IsDescending': isDescending,
                'OrderByClause': orderByClause,
            },
            errors: {
                400: `Bad Request`,
                401: `The resource is protected and requires an authentication token`,
                500: `Server Error`,
            },
        });
    }

    /**
     * @returns string Success
     * @throws ApiError
     */
    public static putContentReviewReview({
requestBody,
}: {
requestBody?: ContentReviewNodePocoModel,
}): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/umbraco/workflow/api/content-review/review',
            body: requestBody,
            mediaType: 'application/json',
            responseHeader: 'Umb-Notifications',
            errors: {
                400: `Bad Request`,
                401: `The resource is protected and requires an authentication token`,
                500: `Server Error`,
            },
        });
    }

    /**
     * @returns any Success
     * @throws ApiError
     */
    public static getContentReviewSeed(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/workflow/api/content-review/seed',
            errors: {
                400: `Bad Request`,
                401: `The resource is protected and requires an authentication token`,
                500: `Server Error`,
            },
        });
    }

}
