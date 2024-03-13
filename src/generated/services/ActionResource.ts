/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ActionWorkflowRequestModel } from '../models/ActionWorkflowRequestModel';
import type { ActionWorkflowResponseModel } from '../models/ActionWorkflowResponseModel';
import type { InitiateWorkflowRequestModel } from '../models/InitiateWorkflowRequestModel';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ActionResource {

    /**
     * @returns any Success
     * @throws ApiError
     */
    public static postActionApprove({
requestBody,
}: {
requestBody?: ActionWorkflowRequestModel,
}): CancelablePromise<ActionWorkflowResponseModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/umbraco/workflow/api/action/approve',
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
    public static postActionCancel({
requestBody,
}: {
requestBody?: ActionWorkflowRequestModel,
}): CancelablePromise<ActionWorkflowResponseModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/umbraco/workflow/api/action/cancel',
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
    public static postActionInitiate({
requestBody,
}: {
requestBody?: InitiateWorkflowRequestModel,
}): CancelablePromise<ActionWorkflowResponseModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/umbraco/workflow/api/action/initiate',
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
    public static postActionReject({
requestBody,
}: {
requestBody?: ActionWorkflowRequestModel,
}): CancelablePromise<ActionWorkflowResponseModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/umbraco/workflow/api/action/reject',
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
    public static postActionResubmit({
requestBody,
}: {
requestBody?: ActionWorkflowRequestModel,
}): CancelablePromise<ActionWorkflowResponseModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/umbraco/workflow/api/action/resubmit',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `The resource is protected and requires an authentication token`,
                500: `Server Error`,
            },
        });
    }

}
