import type { Meta, StoryObj } from "@storybook/web-components";
import './page-size.element.js';
import type { PageSizeDropdownElement } from "./page-size.dropdown.element.js";

const meta: Meta<PageSizeDropdownElement> = {
  title: "Components/Dropdowns/Page Size",
  component: 'workflow-page-size',
};

export default meta;
type Story = StoryObj<PageSizeDropdownElement>;

export const Overview: Story = {
  args: {
    value: 5,
  },
};
