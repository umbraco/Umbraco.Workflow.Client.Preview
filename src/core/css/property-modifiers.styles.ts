import { css } from "@umbraco-cms/backoffice/external/lit";

export const PropertyModifierStyles = css`
  [inert] {
    --readonly-background-color: var(
      --uui-input-background-color-readonly,
      var(--uui-color-disabled, #f3f3f5)
    );
    --readonly-border-color: var(
      --uui-input-border-color-readonly,
      var(--uui-color-disabled-standalone, rgb(226, 226, 226))
    );

    --uui-input-background-color: var(--readonly-background-color);
    --uui-select-background-color: var(--readonly-background-color);

    --uui-input-border-color: var(--readonly-border-color);
    --uui-select-border-color: var(--readonly-border-color);
  }

  [hidden] {
    display: none;
  }

  [unlicensed] {
    opacity: 1;
    position: relative;
    cursor: pointer;
  }

  [unlicensed]::before {
    content: var(--workflowUnlicensed);
    position: absolute;
    z-index: 1;
    top: -2px;
    right: -2px;
    bottom: -2px;
    left: -2px;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.8);
    transition: filter ease-in-out 0.2s;
  }

  [unlicensed]:hover > * {
    filter: blur(2px);
  }
`;
