import type { UmbLocalizationDictionary } from "@umbraco-cms/backoffice/localization-api";
/// TODO => this is the master language, use the keys here to ensure other languages have no gaps
export default {
  workflow: {
    actionWorkflow: `Action workflow`,
    activeWorkflow: `Active workflow`,
    activity: `Workflow activity`,
    asAdmin: `as admin`,
    assignTo: `Assign rejected task`,
    attachment: `Attachment`,
    cancelledWithError: `Processing cancelled due to error`,
    cannotBeEdited: `and cannot be edited`,
    completedByAdmin: `Stage completed by administrator`,
    completedDate: `Completed date`,
    contentReview: `Content review`,
    createdDate: `Created date`,
    currentPageExcluded: `Current page is excluded from the workflow`,
    dateRange: `Range (days)`,
    describeChanges: `Describe the changes`,
    describeChangesOptional: `Describe the changes (optional)`,
    detailButton: `Workflow detail`,
    docIsActive: `Document is currently in a workflow`,
    document: "Document",
    editButton: `Go to node`,
    excludedNodeAlert: `Document is excluded from workflow`,
    hasChanged: `has changed`,
    initiateWorkflow: `Initiate workflow`,
    installedVersion: `Current installed version of Umbraco Workflow:`,
    invalidContent: `Invalid content can not be submitted for workflow approval`,
    groupLanguage: "Group language",
    groupLanguageDescription: "Only required when group email is set",
    learnMoreAbout: `Learn more about`,
    newNodeApprovalFlow: `New node approval flow`,
    newNodeApprovalFlowDescription: `All new nodes use this workflow for initial publishing`,
    newNodeConfig: `New nodes must be saved before configuring workflow`,
    noActiveWorkflow: `No active workflow found`,
    noPendingReview: `There is no pending content review on this node`,
    noPendingWorkflow: `There is no pending workflow on this node`,
    nothingToDo: `There's nothing for you to do...`,
    notifications: "Notifications",
    noUnpublishPermissions: `No unpublish workflow configured for this content item.`,
    originalEditor: `Original editor`,
    outOfDate: `Workflow is out of date.`,
    pageSize: `Page size`,
    pendingApproval: `Pending approval`,
    permissions: "Permissions",
    previousChangesRejected: `Previous changes were rejected`,
    previousGroup: `Previous approval group`,
    publishButton: `Request publish`,
    publishOn: `Publish on`,
    removeAll: `Remove all`,
    requestedBy: `Requested by`,
    requestedOn: `Requested on`,
    requiredApprovals: `Required approvals`,
    selectDocumentTypes: (plural) => `Select Document ${plural ? 'Types' : 'Type'}`,
    selectVariants: (plural) => `Select ${plural ? 'languages' : 'language'}`,
    taskAlreadyApproved: `The task has already been approved by another member of the group`,
    unpublishButton: `Request unpublish`,
    unPublishOn: `Unpublish on`,
    unsavedChanges: `Pending content changes will be saved automatically`,
    updateAvailable: `Update available`,
    userCannotAction: `Current user does not have permission to action the workflow.`,
    userCannotUpdateDocument:
      "The current user does not have permission to update this document.",
    viewAttachment: `View attachment`,
    viewType: `View type`,
    workflowActivity: `Workflow activity`,
    workflowHistory: `Workflow history`,

    action: (suffix = '') => `Action ${suffix}`,
    active: `active`,
    all: `All`,
    approve: `Approve`,
    at: `at`,
    both: `Both`,
    by: `by`,
    configuration: `Configuration`,
    detail: `Detail`,
    exclude: `Exclude`,
    explicit: `Explicit`,
    filters: `Filters`,
    implicit: `Implicit`,
    include: `Include`,
    inherited: `inherited`,
    most: `Most`,
    node: `Node`,
    now: `Now`,
    on: `on`,
    one: `One`,
    optional: `Optional`,
    overview: `Overview`,
    reject: `Reject`,
    resubmit: `Resubmit`,
    some: `Some`,
    stage: `Stage`,
    when: `when`,

    changeDescriptionDetail: `%0% requested by %1% on %2%`,
    commentMaxLength: `Comment max length exceeded - limit is %0% characters`,
    commentRemaining: `%0% characters remaining`,
    historyFor: `Workflow history for %0%`,
    lastDays: `last %0% days`,
    pendingForNode: `Pending %0% workflow for '%1%'`,
    plusMore: `plus %0% more`,
    xOfYApprovalsCompleted: `%0% of %1% required approvals completed`,

    approved: `Approved`,
    cancelled: `Cancelled`,
    errored: `Errored`,
    expired: `Expired`,
    expiring: `Expiring`,
    overdue: `Overdue`,
    pending: `Pending`,
    reviewed: `Reviewed`,
    cancelledbythirdparty: `Cancelled by third party`,
    excluded: `Excluded`,
    notrequired: `Not required`,
    pendingapproval: `Pending approval`,
    rejected: `Rejected`,
    resubmitted: `Resubmitted`,
    awaitingResubmission: `Awaiting resubmission`,

    averageApproval: `Average`,
    fastestApproval: `Fastest approval`,
    slowestApproval: `Slowest approval`,

    noApproval: `APPROVAL NOT REQUIRED`,
    noGroup: `GROUP NOT FOUND`,
    noNode: `NODE NOT FOUND`,
    noUser: `USER NOT FOUND`,

    approvalRejection: `Approval rejection`,
    approvalRequest: `Approval request`,
    approvedAndCompleted: `Approved and completed`,
    approvedAndCompletedForScheduler: `Approved and completed for scheduler`,
    changeDescription: `Change description`,
    currentStatus: `Current status`,
    pendingResubmission: `Pending resubmission`,
    reminder: `Reminder`,
    schedulerActionCancelled: `Scheduler action cancelled`,
    sendTo: `Send to`,
    toAdmin: `Admin`,
    toAuthor: `Author`,
    toAll: `All`,
    toGroup: `Group`,
    sendToDescription: `      
        <ul>
          <li><strong>All</strong> sends to all members of all groups up to and including the current task</li>
          <li><strong>Admin</strong> includes the system email</li>
          <li><strong>Author</strong> includes the editor who initiated the workflow</li>
          <li><strong>Group</strong> sends to the group responsible for the current task</li>
          <li>Duplicate users are removed</li>
        </ul>`,
    summary: `Summary`,
    workflowCancelled: `Workflow cancelled`,
    workflowErrored: `Workflow errored`,

    status1: `Approved`,
    status2: `Rejected`,
    status3: `Pending approval`,
    status4: `Not required`,
    status5: `Cancelled`,
    status6: `Errored`,
    status7: `Resubmitted`,
    status8: `Cancelled by third party`,
    status9: `Excluded`,
    status10: `Awaiting resubmission`,

    contentApprovalFlow: `Content approval flow`,
    currentFlow: `Current flow`,
    currentPageInheritsFrom: `The current document is inheriting workflow permissions from <strong>%0%</strong>`,
    docTypeApprovalFlow: `Document Type approval flow`,
    documentFlows: `Document Type approvals`,
    inheritedApprovalFlow: `Inherited approval flow`,
    nodeApprovalFlows: `Node-based approvals`,
    noDoctypeFlow: `No Document Type flow set for this document`,
    noInheritedFlow: `No inherited approval flow exists for this document`,
    conditionalStages: "Conditional stages",

    approvalGroups: `Approval groups`,
    createGroup: `Create group`,
    contentWorkflowRoles: "Content workflow roles",
    documentTypeWorkflowRoles: "Document Type workflow roles",
    deleteGroup: `Delete group`,
    deleteGroupWarning: `<h4>Careful! This is a destructive action.</h4>
        <p>Deleting a group will cancel all pending tasks and workflows where the group is a participant, and will delete all permissions assigned to the group.</p><p>To delete, type <strong>%0%</strong> below.</p>
    `,
    editGroup: `Edit group`,
    emailGroup: `Email group`,
    groupEmail: `Group email`,
    groupEmailDescription: `Notifications will be sent to this address instead of group members`,
    groupHasNoMembers: `Group has no members`,
    groupPermissionsRemoved: `Group permissions removed`,
    groupsLimitedByLicense: `Maximum groups restricted by license type`,
    groupWorkflowsCancelled: `Group workflows cancelled`,
    inheritedMembership: `Inherited group membership`,
    inheritedMembershipDescription: `Inherit group membership from an existing Umbraco group`,
    languageDescription: `Only required when the group has an email address`,
    membership: `Group members`,
    offlineApproval: `Enable offline approval`,
    roles: `Roles`,
    saveGroup: `Save group`,

    allSettingsHidden: `All settings are hidden - contact your site administrator`,
    appliesTo: `Applies to`,
    publishAndUnpublish: `Publish and unpublish`,
    publishOnly: `Publish only`,
    saveSettings: `Save settings`,
    settingsHiddenOrReadonly: `%0% settings are hidden or readonly - contact your site administrator`,
    unpublishDisabled: `Unpublish workflows are disabled globally`,
    workflowSettingsUpdated: `Workflow settings updated`,

    adminCanEdit: `Administrators can edit`,
    allowAttachments: `Allow attachments`,
    allowScheduling: `Allow scheduling`,
    approvalThreshold: `Approval threshold`,
    configureApprovalThreshold: `Allow configuring approval threshold`,
    documentTypeApprovalFlows: `Document Type approval flows`,
    editUrl: `Edit site URL`,
    email: `Workflow email`,
    emailTemplates: `Email templates`,
    installEmailTemplates: "Install email templates",
    excludeNodes: `Exclude nodes`,
    extendPermissions: `Extend permissions`,
    flowType: `Flow type`,
    lockIfActive: `Lock active content`,
    mandatoryComments: `Mandatory comments`,
    rejectionResetsApprovals: `Rejection resets approvals`,
    reminderDelay: `Reminder delay (days)`,
    requireUnpublish: `Use workflow for unpublish`,
    sendNotifications: `Send notifications`,
    siteUrl: `Site URL`,

    installEmailTemplatesDescription:
      "Workflow provides default templates for the listed actions. To modify these templates, they must be copied to the filesystem.",
    adminCanEditDescription: `Set to true to allow administrators to edit content at any stage of a workflow`,
    allowAttachmentsDescription: `Set to true to allow attaching a media item when intiating a workflow`,
    allowSchedulingDescription: `Set to true to allow scheduling publishing when initiating a workflow`,
    approvalThresholdDescription: `How many group members must approve each workflow task?`,
    approvalThresholdDescriptionExtended: `
          <p>This is a default value and can be overridden when configuring individal workflows.</p>
          <ul>
          <li>One: any member of the approval group can approve the task.</li>
          <li>Most: an absolute majority of members of the approval group must approve the task.</li>
          <li>All: all members of the approval group must approve the task.</li></ul>
    `,
    configureApprovalThresholdDescription: `Enable setting the approval threshold for any stage of a workflow`,
    documentTypeApprovalFlowsDescription: `Configure default workflows for all nodes of a given Document Type`,
    documentTypeApprovalsDescription: `These workflows apply only to the specified Document Type`,
    editUrlDescription: `Edit site URL for inclusion in email notifications (eg http://edit.mydomain.com)`,
    emailDescription: `FROM address for email notifications`,
    excludeNodesDescription: `Nodes (and their descendants) selected here will NOT be included in the workflow, and will revert to the default Umbraco actions`,
    extendPermissionsDescription: `Set to true to extend users' default save and publish permissions. When false, save and publish button is removed`,
    flowTypeDescription: `Controls how the original author is managed in subsequent tasks`,
    flowTypeDescriptionExtended: `<ul>
          <li>Explicit requires all steps be approved, including steps where the original change author is a group member.</li>
          <li>Implicit auto-approves steps where the author is a member of the approving group.</li>
          <li>Exclude behaves similar to Explicit, but excludes the original author from any notifications (ie the author can not approve their own work).</li></ul>
    `,
    lockIfActiveDescription: `Set to true to prevent edits while content is in a workflow`,
    mandatoryCommentsDescription: `Set to true to require comments on workflow approvals`,
    nodeApprovalFlowsDescription: `These workflows apply only to the specified node`,
    offlineApprovalDescription: `Set to true to allow users in this group to approve changes without logging in to the backoffice. Refer to the documentation for full details and setup`,
    rejectionResetsApprovalsDescription: `Set to true with approval threshold set to Most or All, to reset previous approvals when a workflow stage is rejected`,
    reminderDelayDescription: `Send reminder emails for inactive tasks, after this many days. Set to 0 to disable`,
    requireUnpublishDescription: `Set to true to require workflow approval when unpublishing content`,
    sendNotificationsDescription: `Set to true to send email notifications`,
    siteUrlDescription: `Live site URL for inclusion in email notifications (eg http://www.mydomain.com)`,

    mySubmissions: `My submissions`,
    myTasks: `Tasks requiring my approval`,

    invariant: `Invariant`,
    invariantDesc: `Languages without pending workflows will be sent for publishing, using the workflow set on the default language (%0%).`,
    invariantWorkflow: `Invariant workflow`,
    multiVariant: `Multi-variant`,
    multiVariantDesc: `Languages without pending workflows will be sent for publishing, using the workflow set on each language.`,
    multiVariantWorkflow: `Multi-variant workflow`,
    thisVariant: `Just this one`,
    thisVariantDesc: `The current language (%0%) will be sent for publishing.`,
    variant: `Variant`,
    variants: `Variants`,
    variantsActiveAndUnavailable: `Variant workflows unavailable as the following languages have active workflows:`,

    addWorkflowGroups: `Add workflow approval group/s`,
    addComment: `Add a comment`,
    addFile: `Add file`,
    addCondition: `Add condition`,
    addStatus: `Add status`,
    addItem: `Add item`,
    addDocumentType: "Add document type",
    addDocument: "Add document",
    addUser: "Add user",

    licensing: "Licensing",
    licenseImpersonationActive: `Workflow license impersonation is active. All features are available on non-production domains only.`,
    licensedFeature: `This feature requires a license.`,
    licensedFeatureDescription: `<p>Workflow's advanced features require a license. To test these in a development environment, set Umbraco:Workflow:EnableTestLicense to true in appSettings.development.json</p>
    `,
    buyLicensePrompt: `To access advanced features and remove group limits, you must purchase a license.`,
    buyLicense: `Buy a license`,

    invalidOfflineUrl: `<strong>INVALID REQUEST:</strong> The requested URL does not map to a valid workflow process. The task may have already been completed, or the requesting user does not have permission to action the task.
    `,

    scheduledDate: `Scheduled date (optional)`,
    scheduleDescription: `If the scheduled date passes before the workflow is completed, the changes will be published when the final workflow stage has been approved.`,
    scheduledForAt: `Scheduled for %0% on %1% at %2%`,
    schedulePassed: `Scheduled date passed before the workflow was completed. Content will be released when the current workflow is completed.`,
    scheduling: `Scheduling`,

    diffHelp: `The table above shows the differences between the current published version and the pending changes in this workflow.<br /><br />
          <del>Red text</del> will be removed. <ins>Green text</ins> will be added.`,
    diffNoVersions: `Unable to find versions for comparison. Maybe they've been deleted? Try Umbraco's Rollback tool to view all available change history for this item.`,
    diffVariants: `The active workflow includes multiple content variants. Select the language below to view the changes for each variant.`,
    showDiff: `View differences`,
  },
  workflowNotifications: {
    approved: `Workflow completed.`,
    approvedLog: `Workflow approved by %0% on %1% [%2%].`,
    cancelled: `%0% request has been cancelled.`,
    cancelledLog: `%0% request for %1% [%2%] cancelled by %3%.`,
    initiate: `%0% submitted for %1% approval.`,
    initiateScheduled: `Changes scheduled for %2% %0% at %1%.`,
    pageHasBeen: `Page has been %0%`,
    pendingApproval: `Task completed. Page will be %0% following workflow completion.`,
    pendingApprovalLog: `Workflow %0% task on %1% [%2%] approved by %3%.`,
    pendingApprovalResubmit: `Changes resubmitted. Page will be %0% following workflow completion.`,
    pendingApprovalResubmitLog: `%0% request for %1% [%2%] was resubmitted by %3%.`,
    rejected: `%0% request has been rejected.`,
    rejectedLog: `%0% request for %1% [%2%] rejected by %3%.`,
  },
  treeHeaders: {
    active: `Active workflows`,
    approvalGroups: `Approval groups`,
    contentReviews: `Content reviews`,
    history: `History`,
    settings: `Settings`,
  },
  workflowCommentTemplates: {
    homepage: `This is an important
template for the homepage doctype

it can have spaces

and new lines
    `,
  },
  contentReviews: {
    contentItemReviewed: `Content item has been marked as reviewed`,
    contentRequiresReview: `Content requires review`,
    contentRequiresReviewOnOrBefore: `Content requires review on or before %0%`,
    contentReviewActivity: `Content review activity`,
    contentReviews: `Content reviews`,
    currentPageInheritsReview: `The current document is inheriting from <strong>%0%</strong> (via %1% config) for <strong>content reviews</strong>.`,
    docTypeReview: `Document-type review settings`,
    force: `Force`,
    forceDescription: `Set to true to overwrite all existing review dates (excludes node-level review configuration)`,
    lastReviewed: `Last reviewed`,
    lastReviewedByOn: `Last reviewed by %0% on %1%.`,
    markAsReviewed: `Mark as reviewed`,
    nextReviewDue: `Next review due`,
    noContentReviewGroup: `No content review group set for this document`,
    nodeReview: `Content item review settings`,
    noReviewableNodes: `No reviewable nodes found`,
    reviewConfigDeleted: `Content review configuration deleted`,
    reviewGroup: `Review group`,
    reviewOverlayPeriod: `This content must be reviewed every %0% days.`,
    reviewSettingsUpdateFailed: `Unable to update content review settings`,
    reviewSettingsUpdateSucceeded: `Content review settings updated`,
    saveReviewConfigMessage: `This might take a while - saving generates the review due date for all reviewable content, which might be a lot of nodes. This does not modify node-level review configuration.`,
    staleContent: `Stale content`,
    unableToSeedReviewDate: `Unable to update review date for node`,
    generateRelativeTo: `Generate relative to`,
    saveAndRegenerate: `Save and regenerate`,
    externalReviewers: `External reviewers`,
    externalReviewersDescription: `Semi-colon-delimited list of email addresses. These should not be associated with CMS users.`,

    contentItemReviews: `Content item reviews`,
    documentTypeReviews: `Document-type reviews`,
    enableContentReviews: `Enable content reviews`,
    publishIsReview: `Treat publishing as a review?`,
    reminderThreshold: `Reminder threshold (days)`,
    reviewPeriod: `Review period (days)`,

    contentItemReviewsDescription: `Configure reviews for individual content items`,
    documentTypeReviewsDescription: `Configure reviews for all nodes of a given Document Type`,
    enableContentReviewsDescription: `Should users be reminded to review their content?`,
    publishIsReviewDescription: `Should publishing content be treated as a review, or should the content require an explicit review`,
    reminderThresholdDescription: `Review notifications will be sent this many days before the review date. Default is 1`,
    reviewPeriodDescription: `Maximum time period between required content reviews`,
    reviewPeriodDescriptionExtended: `This is the global default and can be over-ridden for individual nodes. When set to 0 (the default), no nodes will be considered reviewable unless a review period is set for the individual node.`,
  },
  workflowCleanup: {
    modalHeadline: `Workflow history cleanup configuration`,
    cleanupEnabled: `History cleanup enabled`,
    contentRules: `Content cleanup rules`,
    daysToKeepHistory: `Days to keep workflow history`,
    docTypeRules: `Document Type cleanup rules`,
    globalSettings: `Global cleanup settings`,
    rulesUpdated: `Workflow history cleanup rules updated`,
    statusesToDelete: `Workflow statuses to delete`,
  },
  workflowSearch: {
    addContentTypes: `Add Content Type(s)`,
    addDataType: `Add Data Type`,
    addProperties: `Add properties`,
    addProperty: `Add property`,
    addPropertyEditor: `Add Property Editor`,
    allProperties: `All properties`,
    datatype: `Data Type`,
    fuzzy: `Approximate search`,
    fuzzyDescription: `Approximate search allows for finding terms that are close matches to the search term, considering slight variations.`,
    propertyEditor: `Property editor`,
    selectContentTypes: `Select Content Type(s)`,
    selectSearchFields: `Select search fields`,
    selectSearchType: `Select search type`,
    showBaseProperties: `Show base properties`,
    singleProperty: `Single property`,
    someProperties: `Some properties`,
    score: `Score`,
  },
} as UmbLocalizationDictionary;
