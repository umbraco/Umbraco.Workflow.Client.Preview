/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PagedWorkflowInstanceResponseModel } from '../models/PagedWorkflowInstanceResponseModel';
import type { WorkflowDiffsModel } from '../models/WorkflowDiffsModel';
import type { WorkflowSearchRequestModel } from '../models/WorkflowSearchRequestModel';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class InstanceResource {

    /**
     * @returns PagedWorkflowInstanceResponseModel Success
     * @throws ApiError
     */
    public static postInstanceActive({
requestBody,
}: {
requestBody?: WorkflowSearchRequestModel,
}): CancelablePromise<PagedWorkflowInstanceResponseModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/umbraco/workflow/api/instance/active',
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
     * @returns PagedWorkflowInstanceResponseModel Success
     * @throws ApiError
     */
    public static postInstanceAll({
requestBody,
}: {
requestBody?: WorkflowSearchRequestModel,
}): CancelablePromise<PagedWorkflowInstanceResponseModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/umbraco/workflow/api/instance/all',
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
     * @returns PagedWorkflowInstanceResponseModel Success
     * @throws ApiError
     */
    public static postInstanceAssignedTo({
requestBody,
}: {
requestBody?: WorkflowSearchRequestModel,
}): CancelablePromise<PagedWorkflowInstanceResponseModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/umbraco/workflow/api/instance/assigned-to',
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
    public static getInstanceDiff({
guid,
}: {
guid?: string,
}): CancelablePromise<WorkflowDiffsModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/workflow/api/instance/diff',
            query: {
                'guid': guid,
            },
            errors: {
                400: `Bad Request`,
                401: `The resource is protected and requires an authentication token`,
                500: `Server Error`,
            },
        });
    }

    /**
     * @returns PagedWorkflowInstanceResponseModel Success
     * @throws ApiError
     */
    public static postInstanceInitiatedBy({
requestBody,
}: {
requestBody?: WorkflowSearchRequestModel,
}): CancelablePromise<PagedWorkflowInstanceResponseModel> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/umbraco/workflow/api/instance/initiated-by',
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
     * @returns PagedWorkflowInstanceResponseModel Success
     * @throws ApiError
     */
    public static getInstanceRange({
days,
}: {
days?: number,
}): CancelablePromise<PagedWorkflowInstanceResponseModel> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/workflow/api/instance/range',
            query: {
                'days': days,
            },
            errors: {
                400: `Bad Request`,
                401: `The resource is protected and requires an authentication token`,
                500: `Server Error`,
            },
        });
    }

    /**
     * @returns boolean Success
     * @throws ApiError
     */
    public static getInstanceStatus({
ids,
}: {
ids?: string,
}): CancelablePromise<Record<string, boolean>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/umbraco/workflow/api/instance/status',
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

}
