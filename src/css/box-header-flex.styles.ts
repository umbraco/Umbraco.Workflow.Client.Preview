import { css } from "@umbraco-cms/backoffice/external/lit";

export const BoxHeaderFlexStyles = css`
  [slot="header-actions"] {
    display: flex;
    justify-content: space-between;
    align-items: center;
    column-gap: var(--uui-size-space-2);
  }
`;
