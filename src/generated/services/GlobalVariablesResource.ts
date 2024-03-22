/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GlobalVariablesResponseModel } from '../models/GlobalVariablesResponseModel';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class GlobalVariablesResource {

    /**
     * @returns any Success
     * @throws ApiError
     */
    public static getGlobal(): CancelablePromise<GlobalVariablesResponseModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/workflow/api/v1/global',
            errors: {
                400: `Bad Request`,
                401: `The resource is protected and requires an authentication token`,
                500: `Server Error`,
            },
        });
    }

}
