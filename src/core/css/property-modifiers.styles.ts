import { css } from "@umbraco-cms/backoffice/external/lit";

export const PropertyModifierStyles = css`
  [inert] {
    opacity: 0.5;
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
