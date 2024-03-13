import type { Meta, StoryObj } from "@storybook/web-components";
import './alert.element.js';
import type { WorkflowAlertElement } from "./alert.element.js";

const meta: Meta<WorkflowAlertElement> = {
  title: "Components/Alert",
  component: 'workflow-alert',
  
};

export default meta;
type Story = StoryObj<WorkflowAlertElement>;

export const Overview: Story = {
  args: {
    text: 'This is a workflow alert for alerting users.'
  },
};

export const Localized: Story = {
  args: {
    key: 'workflow_localizeMe',
  },
};
