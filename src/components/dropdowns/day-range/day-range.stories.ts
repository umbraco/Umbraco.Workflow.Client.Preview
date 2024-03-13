import type { Meta, StoryObj } from "@storybook/web-components";
import './day-range.element.js';
import type { DayRangeDropdownElement } from "./day-range.dropdown.element.js";

const meta: Meta<DayRangeDropdownElement> = {
  title: "Components/Dropdowns/Day Range",
  component: 'workflow-day-range',
};

export default meta;
type Story = StoryObj<DayRangeDropdownElement>;

export const Overview: Story = {
  args: {
    value: 5,
  },
};
