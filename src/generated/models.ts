

export type ActionWorkflowRequestModel = {
        comment: string
taskId: number
groupId: number
instanceGuid: string
offline: boolean
userId?: string | null
isAdmin: boolean
assignTo?: string | null
    };

export type ActionWorkflowResponseModel = {
        workflowStatus: Array<WorkflowStatusModel>
activeWorkflows: Array<WorkflowTaskModel>
    };

export type ActiveTasksModel = {
        invariantTask?: WorkflowTaskModel | null
variantTasks: Array<string>
    };

export type AdvancedSearchQueryModel = {
        contentTypes?: Array<string> | null
cultures?: Array<string> | null
fields: Record<string, unknown>
baseFields: Record<string, unknown>
category: string
searchType: AdvancedSearchTypeModel
take: number
skip: number
fuzzy: boolean
    };

export type AdvancedSearchResponseItemModel = {
        name?: string | null
id?: number | null
key: string
trashed: boolean
score: number
icon: string
    };

export type AdvancedSearchResponseModel = {
        results: Array<AdvancedSearchResponseItemModel>
totalPages: number
totalItems: number
    };

export type AdvancedSearchScaffoldResponseModel = {
        contentTypes: Array<SelectableContentTypePropertyDetailModel>
dataTypes: Array<SelectableNameKeyPairModel>
propertyEditors: Array<SelectableNameKeyPairModel>
    };

export enum AdvancedSearchTypeModel {
    NULL = 'Null',
    ALL = 'All',
    SOME = 'Some',
    SINGLE = 'Single',
    DATATYPE = 'Datatype',
    PROPERTY_EDITOR = 'PropertyEditor'
}

export type ChartDataPointModel = {
        x: string
y: number
    };

export type ChartResponseModel = {
        series: Array<ChartSeriesModel>
additionalData: Record<string, unknown>
currentUserLocale: string
    };

export type ChartSeriesModel = {
        label: string
key: string
borderColor: string
backgroundColor: string
type: string
data: Array<ChartDataPointModel>
    };

export type ConfigTypeModel = {
        alias: string
value?: unknown
    };

export type ContentReviewNodePocoModel = {
        id: number
nodeId: number
reviewedOn?: string | null
dueOn?: string | null
reviewedBy?: number | null
variant?: string | null
    };

export type ContentReviewsConfigModel = {
        contentTypes: Array<ContentTypePropertyModel>
settings: ContentReviewsSettingsModel
availableLanguages: Array<LanguageModel>
    };

export type ContentReviewsDetailedConfigModel = {
        id: number
documentKey?: string | null
name: string
documentTypeKey?: string | null
excluded: boolean
expired: boolean
period: number
variant: string
variantName: string
groups: Array<UserGroupBaseModel>
groupIds: string
dueOn?: string | null
reviewedOn?: string | null
reviewedBy?: UserSlimModel | null
readonly inherited: boolean
inheritedFrom: string
inheritedType: string
icon: string
responsibleUsers: Array<string>
isDefaultVariant: boolean
externalReviewers?: string | null
    };

export type ContentReviewsNodeQueryResponseModel = {
        nodeKey: string
userKey: string
variant: string
config?: ContentReviewsDetailedConfigModel | null
currentUserShouldReview: boolean
    };

export type ContentReviewsSaveSettingsModel = {
        config: Array<ContentReviewsDetailedConfigModel>
settings: ContentReviewsSettingsModel
delete: Array<number>
regenerate: boolean
    };

export type ContentReviewsSettingsModel = {
        properties: Array<SettingsPropertyDisplayModel>
contentItemReviews: SettingsPropertyDisplayModel
documentTypeReviews: SettingsPropertyDisplayModel
relativeTo: number
force: boolean
    };

export type ContentSlimModel = {
        path?: string | null
nodeName?: string | null
nodeId: number
contentTypeId: number
contentTypeAlias?: string | null
icon: string
trashed: boolean
key: string
contentTypeKey: string
    };

export type ContentTypePropertyModel = {
        name?: string | null
alias?: string | null
id: number
key: string
varies: boolean
icon: string
properties: Array<PropertyModel>
permissions: Array<UserGroupPermissionsModel>
    };

export type DateRangeModel = {
        from?: string | null
to?: string | null
    };

export enum EventMessageTypeModel {
    DEFAULT = 'Default',
    INFO = 'Info',
    ERROR = 'Error',
    SUCCESS = 'Success',
    WARNING = 'Warning'
}

export type FilterModel = {
        unique?: string | null
groupId?: string | null
authorUserId?: string | null
variant?: string | null
type?: number | null
expired?: boolean | null
historyOnly?: boolean | null
status?: Array<number> | null
createdDate?: DateRangeModel | null
completedDate?: DateRangeModel | null
reviewedOn?: DateRangeModel | null
dueOn?: DateRangeModel | null
    };

export type GeneralSettingsModel = {
        properties: Array<SettingsPropertyDisplayModel>
excludeNodes: SettingsPropertyDisplayModel
newNodeApprovalFlow: SettingsPropertyDisplayModel
documentTypeApprovalFlows: SettingsPropertyDisplayModel
    };

export type GlobalVariablesResponseModel = {
        defaultCulture?: string | null
defaultCultureName?: string | null
currentUserLocale?: string | null
currentUserIsAdmin: boolean
currentUserUnique?: string | null
availableLanguages: Array<LanguageModel>
historyCleanupEnabled: boolean
configureApprovalThreshold: boolean
defaultApprovalThreshold: number
mandatoryComments: boolean
    };

export type HistoryCleanupConfigModel = {
        enableCleanup: boolean
keepHistoryForDays?: number | null
statusesToDelete: Record<string, boolean>
isNodeConfig: boolean
editable: boolean
entityKey: string
entityName?: string | null
    };

export type HistoryCleanupModel = {
        enableCleanup: boolean
keepHistoryForDays: number
statusesToDelete: Record<string, boolean>
cleanupRules: Record<string, HistoryCleanupConfigModel>
    };

export type InitiateWorkflowRequestModel = {
        entityId: string
comment: string
publish: boolean
variant: Array<string>
releaseDate?: string | null
expireDate?: string | null
attachmentId?: number | null
variantToInitiate: string
userId?: string | null
type: WorkflowTypeModel
    };

export type InstanceDetailModel = {
        completedOn?: string | null
requestedOn: string
expireDate?: string | null
releaseDate?: string | null
key: string
requestedByKey: string
totalSteps: number
requestedBy?: string | null
variantCode?: string | null
variantName?: string | null
attachment?: string | null
comment?: string | null
readonly status?: string | null
readonly type?: string | null
    };

export type LanguageModel = {
        name: string
isoCode: string
    };

export type NodePermissionsResponseModel = {
        nodeId: number
node: Array<UserGroupPermissionsModel>
contentType: Array<UserGroupPermissionsModel>
inherited: Array<UserGroupPermissionsModel>
new: Array<UserGroupPermissionsModel>
excluded: boolean
    };

export type NodeSlimModel = {
        key: string
contentTypeKey: string
name?: string | null
url: string
exists: boolean
new: boolean
icon: string
    };

export type NotificationHeaderModel = {
        message: string
category: string
type: EventMessageTypeModel
    };

export type NotificationsSettingsModel = {
        properties: Array<SettingsPropertyDisplayModel>
emailTemplates: SettingsPropertyDisplayModel
    };

export type PackageVersionModel = {
        installedVersion?: string | null
latestVersion?: string | null
outOfDate: boolean
    };

export type PagedContentReviewsDetailedConfigModel = {
        currentPage: number
totalItems: number
itemsPerPage: number
items: Array<ContentReviewsDetailedConfigModel>
defaultCulture: string
    };

export type PagedUserGroupBaseModel = {
        currentPage: number
totalItems: number
itemsPerPage: number
items: Array<UserGroupBaseModel>
defaultCulture: string
    };

export type PagedUserGroupModel = {
        currentPage: number
totalItems: number
itemsPerPage: number
items: Array<UserGroupModel>
defaultCulture: string
    };

export type PagedWorkflowInstanceResponseModel = {
        currentPage: number
totalItems: number
itemsPerPage: number
items: Array<WorkflowInstanceResponseModel>
defaultCulture: string
    };

export type ProblemDetails = {
        type?: string | null
title?: string | null
status?: number | null
detail?: string | null
instance?: string | null
[key: string]: unknown | undefined
    };

export type PropertyDetailModel = {
        name: string
key: string
selected: boolean
dataTypeKey: string
propertyEditorAlias?: string | null
propertyEditorUiAlias?: string | null
alias: string
config?: Record<string, unknown> | null
view: string
icon: string
value?: unknown
    };

export type PropertyModel = {
        name: string
key: string
selected: boolean
    };

export type SelectableContentTypePropertyDetailModel = {
        name?: string | null
alias?: string | null
id: number
key: string
varies: boolean
icon: string
properties: Array<PropertyDetailModel>
permissions: Array<UserGroupPermissionsModel>
selected: boolean
    };

export type SelectableNameKeyPairModel = {
        key?: string | null
name?: string | null
icon?: string | null
selected: boolean
    };

export type SettingsPropertyDisplayModel = {
        alias: string
label: string
description: string
extendedDescription: string
editorUiAlias: string
value?: unknown
validation: unknown
config: Array<ConfigTypeModel>
hideLabel: boolean
readonly: boolean
hidden: boolean
requiresLicense: boolean
    };

export enum TaskStatusModel {
    NULL = 'Null',
    APPROVED = 'Approved',
    REJECTED = 'Rejected',
    PENDING_APPROVAL = 'PendingApproval',
    NOT_REQUIRED = 'NotRequired',
    CANCELLED = 'Cancelled',
    ERRORED = 'Errored',
    RESUBMITTED = 'Resubmitted',
    CANCELLED_BY_THIRD_PARTY = 'CancelledByThirdParty',
    EXCLUDED = 'Excluded',
    AWAITING_RESUBMISSION = 'AwaitingResubmission'
}

export type User2UserGroupModel = {
        userId: string
groupId: string
username?: string | null
name?: string | null
email?: string | null
inherited: boolean
isActive: boolean
    };

export type UserGroupBaseModel = {
        groupId: number
unique: string
name: string
groupEmail?: string | null
description?: string | null
icon?: string | null
groupLanguage?: string | null
users: Array<User2UserGroupModel>
    };

export type UserGroupModel = {
        groupId: number
unique: string
name: string
groupEmail?: string | null
description?: string | null
icon?: string | null
groupLanguage?: string | null
users: Array<User2UserGroupModel>
alias: string
offlineApproval: boolean
deleted: boolean
permissions: Array<UserGroupPermissionsModel>
readonly usersSummary: string
inheritMembers: string
properties: Array<SettingsPropertyDisplayModel>
availableLanguages: Record<string, string>
    };

export type UserGroupPermissionsModel = {
        id: number
nodeKey?: string | null
groupKey: string
contentTypeKey?: string | null
nodeId: number
groupId: number
groupName: string
contentTypeId: number
permission: number
condition?: string | null
variant: string
nodeName?: string | null
contentTypeName?: string | null
contentTypeAlias?: string | null
approvalThreshold?: number | null
    };

export type UserSlimModel = {
        key: string
name?: string | null
allowedSections: Array<string>
    };

export enum WorkflowActionModel {
    ANY = 'Any',
    APPROVE = 'Approve',
    REJECT = 'Reject',
    CANCEL = 'Cancel',
    INITIATE = 'Initiate',
    RESUBMIT = 'Resubmit',
    COMPLETE = 'Complete',
    ERROR = 'Error'
}

export type WorkflowConfigRequestModel = {
        nodeId: number
contentTypeId: number
variant: string
    };

export type WorkflowConfigResponseModel = {
        id: number
key?: string | null
variant: string
permissions: Array<UserGroupPermissionsModel>
    };

export type WorkflowConfigUpdateRequestModel = {
        id: number
key?: string | null
variant: string
permissions: Array<Partial<UserGroupPermissionsModel>>
    };

export type WorkflowContentDiffModel = {
        name?: string | null
language: LanguageModel
tabs: Array<WorkflowDiffTabModel>
    };

export type WorkflowDiffPropertyModel = {
        label?: string | null
value?: unknown
    };

export type WorkflowDiffTabModel = {
        properties: Array<WorkflowDiffPropertyModel>
    };

export type WorkflowDiffsModel = {
        currentVariants: Array<WorkflowContentDiffModel>
workflowVariants: Array<WorkflowContentDiffModel>
    };

export type WorkflowInstanceResponseModel = {
        node?: NodeSlimModel | null
instance?: InstanceDetailModel | null
permissions: Array<WorkflowPermissionResponseModel>
tasks: Array<WorkflowTaskResponseModel>
    };

export type WorkflowLicenseModel = {
        isTrial: boolean
isImpersonating: boolean
isLicensed: boolean
maxGroups: number
    };

export type WorkflowPermissionResponseModel = {
        permission: number
groupName?: string | null
    };

export type WorkflowScaffoldResponseModel = {
        settings?: WorkflowSettingsBaseModel | null
config?: NodePermissionsResponseModel | null
review?: ContentReviewsNodeQueryResponseModel | null
tasks?: ActiveTasksModel | null
activeVariants: Array<string>
    };

export type WorkflowSearchRequestModel = {
        groupId?: string | null
skip?: number | null
take: number
variant?: string | null
sortBy: string
sortDirection: string
filters: FilterModel
    };

export type WorkflowSettingsBaseModel = {
        flowType: number
mandatoryComments: boolean
lockIfActive: boolean
adminCanEdit: boolean
allowAttachments: boolean
requireUnpublish: boolean
allowScheduling: boolean
approvalThreshold: number
configureApprovalThreshold: boolean
    };

export type WorkflowSettingsPropertiesModel = {
        generalSettings: GeneralSettingsModel
notificationsSettings: NotificationsSettingsModel
availableLanguages: Array<LanguageModel>
    };

export enum WorkflowStatusModel {
    NULL = 'Null',
    APPROVED = 'Approved',
    REJECTED = 'Rejected',
    PENDING_APPROVAL = 'PendingApproval',
    NOT_REQUIRED = 'NotRequired',
    CANCELLED = 'Cancelled',
    ERRORED = 'Errored',
    RESUBMITTED = 'Resubmitted',
    CANCELLED_BY_THIRD_PARTY = 'CancelledByThirdParty'
}

export type WorkflowTaskCollectionItemModel = {
        actionedByName?: string | null
actionedById?: string | null
actionedByAdmin: boolean
actionedOn?: string | null
comment?: string | null
status?: number | null
linked: boolean
future: boolean
    };

export type WorkflowTaskCollectionModel = {
        groupName?: string | null
items: Array<WorkflowTaskCollectionItemModel>
status?: number | null
actionedByAdmin: boolean
approvalCount: number
approvalsRequired: number
approvalsText?: string | null
approvalStep: number
future: boolean
    };

export type WorkflowTaskModel = {
        actionedByAdmin?: boolean | null
completedOn?: string | null
requestedOn: string
actionedByUserId?: string | null
assignTo?: string | null
groupId?: string | null
approvedByIds: Array<string>
instance?: InstanceDetailModel | null
currentStep: number
id: number
typeId: number
status?: number | null
node?: NodeSlimModel | null
backofficeUrl?: string | null
comment?: string | null
completedBy?: string | null
groupName?: string | null
offlineApprovalUrl?: string | null
statusName?: string | null
type?: string | null
typeDescription?: string | null
userGroup?: UserGroupModel | null
    };

export type WorkflowTaskResponseModel = {
        currentStep: number
status?: string | null
groupName: string
completedBy: string
    };

export type WorkflowTasksForInstanceResponseModel = {
        taskCollection: Array<WorkflowTaskCollectionModel>
totalSteps: number
currentStep: number
    };

export enum WorkflowTypeModel {
    BOTH = 'Both',
    PUBLISH = 'Publish',
    UNPUBLISH = 'Unpublish'
}

export type ActionData = {
        
        payloads: {
            PostActionApprove: {
                        requestBody?: ActionWorkflowRequestModel
                        
                    };
PostActionCancel: {
                        requestBody?: ActionWorkflowRequestModel
                        
                    };
PostActionInitiate: {
                        requestBody?: InitiateWorkflowRequestModel
                        
                    };
PostActionReject: {
                        requestBody?: ActionWorkflowRequestModel
                        
                    };
PostActionResubmit: {
                        requestBody?: ActionWorkflowRequestModel
                        
                    };
        }
        
        
        responses: {
            PostActionApprove: ActionWorkflowResponseModel
                ,PostActionCancel: ActionWorkflowResponseModel
                ,PostActionInitiate: ActionWorkflowResponseModel
                ,PostActionReject: ActionWorkflowResponseModel
                ,PostActionResubmit: ActionWorkflowResponseModel
                
        }
        
    }

export type AdvancedSearchData = {
        
        payloads: {
            PostAdvancedSearchSearch: {
                        requestBody?: AdvancedSearchQueryModel
                        
                    };
        }
        
        
        responses: {
            GetAdvancedSearchContentTypes: AdvancedSearchScaffoldResponseModel
                ,PostAdvancedSearchSearch: AdvancedSearchResponseModel
                
        }
        
    }

export type ApprovalGroupData = {
        
        payloads: {
            PostApprovalGroup: {
                        requestBody?: UserGroupModel
                        
                    };
GetApprovalGroup: {
                        filter?: string
skip?: number
take?: number
                        
                    };
GetApprovalGroupById: {
                        id: string
                        
                    };
DeleteApprovalGroupById: {
                        id: string
                        
                    };
PutApprovalGroupById: {
                        id: string
requestBody?: UserGroupModel
                        
                    };
GetApprovalGroupInheritedMembers: {
                        ids?: string
                        
                    };
GetApprovalGroupSlim: {
                        filter?: string
skip?: number
take?: number
                        
                    };
        }
        
        
        responses: {
            PostApprovalGroup: string
                ,GetApprovalGroup: PagedUserGroupModel
                ,GetApprovalGroupById: UserGroupModel
                ,DeleteApprovalGroupById: string
                ,PutApprovalGroupById: string
                ,GetApprovalGroupInheritedMembers: Array<User2UserGroupModel>
                ,GetApprovalGroupScaffold: UserGroupModel
                ,GetApprovalGroupSlim: PagedUserGroupBaseModel
                
        }
        
    }

export type ChartData = {
        
        payloads: {
            GetChartContentReviewChart: {
                        range?: number
                        
                    };
GetChartWorkflowChart: {
                        groupId?: string
range?: number
                        
                    };
        }
        
        
        responses: {
            GetChartContentReviewChart: ChartResponseModel
                ,GetChartWorkflowChart: ChartResponseModel
                
        }
        
    }

export type ConfigData = {
        
        payloads: {
            GetConfig: {
                        requestBody?: WorkflowConfigRequestModel
                        
                    };
PutConfig: {
                        requestBody?: WorkflowConfigUpdateRequestModel
                        
                    };
        }
        
        
        responses: {
            GetConfig: NodePermissionsResponseModel
                ,PutConfig: WorkflowConfigResponseModel
                
        }
        
    }

export type ContentReviewData = {
        
        payloads: {
            GetContentReviewCheck: {
                        contentTypeId?: number
nodeId?: number
nodeKey?: string
variant?: string
                        
                    };
PutContentReviewConfig: {
                        requestBody?: ContentReviewsSaveSettingsModel
                        
                    };
PostContentReviewNodes: {
                        requestBody?: WorkflowSearchRequestModel
                        
                    };
PutContentReviewReview: {
                        requestBody?: ContentReviewNodePocoModel
                        
                    };
        }
        
        
        responses: {
            GetContentReviewCheck: ContentReviewsNodeQueryResponseModel
                ,GetContentReviewConfig: ContentReviewsConfigModel
                ,PutContentReviewConfig: ContentReviewsConfigModel
                ,PostContentReviewNodes: PagedContentReviewsDetailedConfigModel
                ,PutContentReviewReview: string
                ,GetContentReviewSeed: any
                
        }
        
    }

export type ContentData = {
        
        payloads: {
            GetContentContentSlim: {
                        ids?: string
                        
                    };
        }
        
        
        responses: {
            GetContentContentSlim: Array<ContentSlimModel>
                ,GetContentContentTypes: Array<ContentTypePropertyModel>
                
        }
        
    }

export type EmailTemplateData = {
        
        
        responses: {
            GetEmailTemplateInstall: Array<string>
                
        }
        
    }

export type GlobalVariablesData = {
        
        
        responses: {
            GetGlobal: GlobalVariablesResponseModel
                
        }
        
    }

export type HistoryCleanupData = {
        
        payloads: {
            GetHistoryCleanup: {
                        contentTypeId?: string
uniqueId?: string
                        
                    };
PutHistoryCleanup: {
                        requestBody?: Record<string, HistoryCleanupConfigModel>
                        
                    };
        }
        
        
        responses: {
            GetHistoryCleanup: HistoryCleanupModel
                ,PutHistoryCleanup: string
                
        }
        
    }

export type InstanceData = {
        
        payloads: {
            PostInstanceActive: {
                        requestBody?: WorkflowSearchRequestModel
                        
                    };
PostInstanceAll: {
                        requestBody?: WorkflowSearchRequestModel
                        
                    };
PostInstanceAssignedTo: {
                        requestBody?: WorkflowSearchRequestModel
                        
                    };
GetInstanceDiff: {
                        guid?: string
                        
                    };
PostInstanceInitiatedBy: {
                        requestBody?: WorkflowSearchRequestModel
                        
                    };
GetInstanceRange: {
                        days?: number
                        
                    };
GetInstanceStatus: {
                        ids?: string
                        
                    };
        }
        
        
        responses: {
            PostInstanceActive: PagedWorkflowInstanceResponseModel
                ,PostInstanceAll: PagedWorkflowInstanceResponseModel
                ,PostInstanceAssignedTo: PagedWorkflowInstanceResponseModel
                ,GetInstanceDiff: WorkflowDiffsModel
                ,PostInstanceInitiatedBy: PagedWorkflowInstanceResponseModel
                ,GetInstanceRange: PagedWorkflowInstanceResponseModel
                ,GetInstanceStatus: Record<string, boolean>
                
        }
        
    }

export type LicenseData = {
        
        
        responses: {
            GetLicense: any
                
        }
        
    }

export type ScaffoldData = {
        
        payloads: {
            GetScaffold: {
                        contentTypeId?: number
contentTypeKey?: string
nodeId?: number
nodeKey?: string
path?: string
variant?: string
                        
                    };
        }
        
        
        responses: {
            GetScaffold: WorkflowScaffoldResponseModel
                
        }
        
    }

export type SettingsData = {
        
        payloads: {
            PutSettings: {
                        requestBody?: WorkflowSettingsPropertiesModel
                        
                    };
        }
        
        
        responses: {
            GetSettings: WorkflowSettingsPropertiesModel
                ,PutSettings: WorkflowSettingsPropertiesModel
                ,GetSettingsVersion: PackageVersionModel
                
        }
        
    }

export type TaskData = {
        
        payloads: {
            GetTaskById: {
                        id: string
                        
                    };
GetTaskActiveVariantsById: {
                        id: string
                        
                    };
        }
        
        
        responses: {
            GetTaskById: WorkflowTasksForInstanceResponseModel
                ,GetTaskActiveVariantsById: Array<string>
                
        }
        
    }