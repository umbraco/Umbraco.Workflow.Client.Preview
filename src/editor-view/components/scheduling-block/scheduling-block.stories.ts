import type { Meta, StoryObj } from "@storybook/web-components";
import "./scheduling-block.element.js";
import type { WorkflowSchedulingBlockElement } from "./scheduling-block.element.js";
import { WorkflowStatusModel } from "@umbraco-workflow/generated";

const meta: Meta<WorkflowSchedulingBlockElement> = {
  title: "Editor View/Components/Scheduling block",
  component: "workflow-scheduling-block",
};

export default meta;
type Story = StoryObj<WorkflowSchedulingBlockElement>;

export const Overview: Story = {
  args: {
    item: {
      instance: {
        releaseDate: "05/05/2022",
        status: WorkflowStatusModel.PENDING_APPROVAL,
        totalSteps: 2,
        requestedOn: "02/02/2022",
        requestedByKey: "",
        key: "",
      },
      requestedOn: "03/04/2022",
      id: 1,
      typeId: 2,
      approvedByIds: [],
      currentStep: 1,
    },
  },
};
