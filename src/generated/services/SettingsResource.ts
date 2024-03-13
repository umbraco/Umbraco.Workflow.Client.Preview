/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PackageVersionModel } from '../models/PackageVersionModel';
import type { WorkflowSettingsPropertiesModel } from '../models/WorkflowSettingsPropertiesModel';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class SettingsResource {

    /**
     * @returns any Success
     * @throws ApiError
     */
    public static getSettings(): CancelablePromise<WorkflowSettingsPropertiesModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/workflow/api/settings',
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
    public static putSettings({
requestBody,
}: {
requestBody?: WorkflowSettingsPropertiesModel,
}): CancelablePromise<WorkflowSettingsPropertiesModel> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/umbraco/workflow/api/settings',
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
     * @returns any Success
     * @throws ApiError
     */
    public static getSettingsVersion(): CancelablePromise<PackageVersionModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/workflow/api/settings/version',
            errors: {
                400: `Bad Request`,
                401: `The resource is protected and requires an authentication token`,
                500: `Server Error`,
            },
        });
    }

}
