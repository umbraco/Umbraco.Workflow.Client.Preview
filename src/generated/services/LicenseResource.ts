/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class LicenseResource {

    /**
     * @returns any Success
     * @throws ApiError
     */
    public static getLicense(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/workflow/api/v1/license',
            errors: {
                401: `The resource is protected and requires an authentication token`,
            },
        });
    }

}
