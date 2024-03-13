import type { Meta, StoryObj } from "@storybook/web-components";
import './language-block.element.js';
import type { WorkflowLanguageBlockElement } from "./language-block.element.js";

const meta: Meta<WorkflowLanguageBlockElement> = {
  title: "Editor View/Components/Language block",
  component: 'workflow-language-block',
};

export default meta;
type Story = StoryObj<WorkflowLanguageBlockElement>;

export const Overview: Story = {
  args: {
    language: "English (United States)",
  },
};
