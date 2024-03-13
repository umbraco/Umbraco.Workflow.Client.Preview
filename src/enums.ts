export enum WorkflowStatus {
    APPROVED = 1,
    REJECTED = 2,
    PENDING_APPROVAL = 3,
    NOT_REQUIRED = 4,
    CANCELLED = 5,
    ERRORED = 6,
    RESUBMITTED = 7,
    CANCELLED_BY_THIRD_PARTY = 8,
    EXCLUDED = 9,
    AWAITING_RESUBMISSION = 10,
}

export enum TaskStatus {
    APPROVED = 1,
    REJECTED = 2,
    PENDING_APPROVAL = 3,
    NOT_REQUIRED = 4,
    CANCELLED = 5,
    ERRORED = 6,
    RESUBMITTED = 7,
    CANCELLED_BY_THIRD_PARTY = 8,
    EXCLUDED = 9,
    AWAITING_RESUBMISSION = 10,
}

export enum PermissionType {
    NEW = "new",
    NODE = "node",
    CONTENT_TYPE = "contentType",
    INHERITED = "inherited",
}

export enum SortDirection {
    ASC =  'up',
    DESC = 'down',
}

export enum SubView {
    ACTIVE = "active",
    CONFIG = "config",
    HISTORY = "history",
  }