import type { Preview } from "@storybook/web-components";

import '@umbraco-ui/uui-css/dist/uui-css.css';
import '@umbraco-ui/uui-textarea';
import '@umbraco-cms/backoffice/components';
import '../src/css/workflow.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
