import type { Meta, StoryObj } from "@storybook/web-components";
import { type WorkflowStatusBlockElement } from "./status-block.element.js";

const meta: Meta<WorkflowStatusBlockElement> = {
  title: "Editor View/Components/Status Block",
  component: "workflow-status-block",
};

export default meta;
type Story = StoryObj<WorkflowStatusBlockElement>;

export const Overview: Story = {
  args: {
    task: {
      status: 1,
      requestedOn: "Yesterday",
      approvedByIds: [],
      currentStep: 1,
      id: 1,
      typeId: 0,
    },
    isAdmin: false,
  },
};

export const Rejected: Story = {
  args: {
    task: {
      status: 2,
      requestedOn: "Yesterday",
      approvedByIds: [],
      currentStep: 1,
      id: 1,
      typeId: 0,
    },
    isAdmin: false,
  },
};

export const PendingApproval: Story = {
  args: {
    task: {
      status: 3,
      requestedOn: "Yesterday",
      approvedByIds: [],
      currentStep: 1,
      id: 1,
      typeId: 0,
      userGroup: {
        key: "",
        alias: "alias",
        deleted: false,
        permissions: [],
        usersSummary: "",
        inheritMembers: "",
        properties: [],
        name: "Group Name",
        offlineApproval: false,
        users: [],
        groupId: 1,
        availableLanguages: { "en-us": "English (US)" },
      },
    },
    isAdmin: false,
  },
};
