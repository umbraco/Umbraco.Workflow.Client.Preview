/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChartResponseModel } from '../models/ChartResponseModel';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ChartResource {

    /**
     * @returns any Success
     * @throws ApiError
     */
    public static getChartContentReviewChart({
range,
}: {
range?: number,
}): CancelablePromise<ChartResponseModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/workflow/api/chart/content-review-chart',
            query: {
                'range': range,
            },
            errors: {
                401: `The resource is protected and requires an authentication token`,
            },
        });
    }

    /**
     * @returns any Success
     * @throws ApiError
     */
    public static getChartWorkflowChart({
range,
groupId,
}: {
range?: number,
groupId?: string,
}): CancelablePromise<ChartResponseModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/workflow/api/chart/workflow-chart',
            query: {
                'range': range,
                'groupId': groupId,
            },
            errors: {
                401: `The resource is protected and requires an authentication token`,
            },
        });
    }

}
