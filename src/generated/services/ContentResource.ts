/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContentSlimModel } from '../models/ContentSlimModel';
import type { ContentTypePropertyModel } from '../models/ContentTypePropertyModel';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ContentResource {

    /**
     * @returns any Success
     * @throws ApiError
     */
    public static getContentContentSlim({
ids,
}: {
ids?: string,
}): CancelablePromise<Array<ContentSlimModel>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/workflow/api/v1/content/content-slim',
            query: {
                'ids': ids,
            },
            errors: {
                400: `Bad Request`,
                401: `The resource is protected and requires an authentication token`,
                500: `Server Error`,
            },
        });
    }

    /**
     * @returns ContentTypePropertyModel Success
     * @throws ApiError
     */
    public static getContentContentTypes(): CancelablePromise<Array<ContentTypePropertyModel>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/workflow/api/v1/content/content-types',
            errors: {
                400: `Bad Request`,
                401: `The resource is protected and requires an authentication token`,
                500: `Server Error`,
            },
        });
    }

}
