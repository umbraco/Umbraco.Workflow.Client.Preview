import { css } from "@umbraco-cms/backoffice/external/lit";

export const WorkflowTagColorStyles = css`
  [workflow-color="approved"] {
    --color: var(--workflow-approved);
    --color-contrast: #fff;
  }

  [workflow-color="errored"] {
    --color: var(--workflow-errored);
    --color-contrast: #fff;
  }

  [workflow-color^="pending"] {
    --color: var(--workflow-pending);
    --color-contrast: #fff;
  }

  [workflow-color="cancelled"] {
    --color: var(--workflow-cancelled);
    --color-contrast: var(--uui-color-warning-contrast);
  }

  [workflow-color="resubmitted"] {
    --color: var(--workflow-resubmitted);
    --color-contrast: #fff;
  }

  [workflow-color="rejected"] {
    --color: var(--workflow-rejected);
    --color-contrast: var(--uui-color-warning-contrast);
  }
`;
