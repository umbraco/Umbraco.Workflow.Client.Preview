import type { Meta, StoryObj } from "@storybook/web-components";
import './comments.element.js';
import type { WorkflowCommentsElement } from "./comments.element.js";

const meta: Meta<WorkflowCommentsElement> = {
  title: "Editor View/Components/Comments",
  component: 'workflow-comments',
};

export default meta;
type Story = StoryObj<WorkflowCommentsElement>;

export const Overview: Story = {
  args: {
    comment: 'Comments go in the comments component',
    labelKey: 'workflow_comments',
    mandatory: false,
  },
};
