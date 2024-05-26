/**
  generate colors by matching status enum values
  classnames will be provided as `status-n` where n matches:

  export enum WorkflowStatus {
    Approved = 1,
    Rejected = 2,
    PendingApproval = 3,
    NotRequired = 4,
    Cancelled = 5,
    Errored = 6,
    Resubmitted = 7,
    CancelledByThirdParty = 8,
    Excluded = 9,
    AwaitingResubmission = 10,
  }
*/

import { css } from "@umbraco-cms/backoffice/external/lit";

export const WorkflowColorStyles = css`
  .background-status-rejected,
  .color-status-approved {
    color: var(--workflow-approved);
  }

  .uui-badge--status-approved,
  .background-status-approved {
    background-color: var(--workflow-approved);
  }

  .color-status-rejected {
    color: var(--workflow-rejected);
  }
  .uui-badge--status-rejected,
  .background-status-rejected {
    background-color: var(--workflow-rejected);
  }

  .color-status-pendingapproval,
  .color-status-awaitingresubmission,
  .background-status-cancelled,
  .background-status-cancelledbythirdparty .background-status-notrequired,
  .background-status-excluded {
    color: var(--workflow-pending);
  }

  .uui-badge--status-pendingapproval,
  .background-status-pendingapproval,
  .uui-badge--status-awaitingresubmission,
  .background-status-awaitingresubmission {
    background-color: var(--workflow-pending);
  }

  .color-status-errored {
    color: var(--workflow-errored);
  }

  .uui-badge--status-errored,
  .background-status-errored {
    background-color: var(--workflow-errored);
  }

  .color-status-resubmitted {
    color: var(--workflow-resubmitted);
  }

  .uui-badge--status-resubmitted,
  .background-status-resubmitted {
    background-color: var(--workflow-resubmitted);
  }

  .uui-badge--status-notrequired,
  .uui-badge--status-cancelled,
  .uui-badge--status-cancelledbythirdparty,
  .uui-badge--status-excluded,
  .background-status-notrequired,
  .background-status-cancelled,
  .background-status-cancelledbythirdparty,
  .background-status-excluded {
    background-color: var(--workflow-cancelled);
  }

  .color-status-cancelledbythirdparty {
    color: var(--workflow-cancelled);
  }

  .color-status-notrequired,
  .color-status-excluded {
    color: var(--workflow-default);
  }

  .background-status-approved,
  .background-status-pendingapproval,
  .background-status-errored,
  .background-status-resubmitted,
  .background-status-awaitingresubmission,
  [class*="uui-badge--status-"] {
    color: #ffffff;
    --uui-button-contrast: #fff;
  }

  .uui-badge--status-notrequired,
  .uui-badge--status-cancelled,
  .uui-badge--status-cancelledbythirdparty,
  .uui-badge--status-excluded {
    color: var(--uui-color-default);
  }
`;
