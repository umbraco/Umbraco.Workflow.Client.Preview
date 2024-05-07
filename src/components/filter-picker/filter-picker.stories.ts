import type { Meta, StoryObj } from "@storybook/web-components";
import type { FilterPickerElement } from "./filter-picker.element.js";

const meta: Meta<FilterPickerElement> = {
  title: "Components/Filter Picker",
  component: "workflow-filter-picker",
};

export default meta;
type Story = StoryObj<FilterPickerElement>;

export const Overview: Story = {
  args: {},
};
