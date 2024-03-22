/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdvancedSearchQueryModel } from '../models/AdvancedSearchQueryModel';
import type { AdvancedSearchResponseModel } from '../models/AdvancedSearchResponseModel';
import type { AdvancedSearchScaffoldResponseModel } from '../models/AdvancedSearchScaffoldResponseModel';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AdvancedSearchResource {

    /**
     * @returns any Success
     * @throws ApiError
     */
    public static getAdvancedSearchContentTypes(): CancelablePromise<AdvancedSearchScaffoldResponseModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/workflow/api/v1/advanced-search/content-types',
            errors: {
                401: `The resource is protected and requires an authentication token`,
            },
        });
    }

    /**
     * @returns any Success
     * @throws ApiError
     */
    public static postAdvancedSearchSearch({
requestBody,
}: {
requestBody?: AdvancedSearchQueryModel,
}): CancelablePromise<AdvancedSearchResponseModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/umbraco/workflow/api/v1/advanced-search/search',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `The resource is protected and requires an authentication token`,
            },
        });
    }

}
