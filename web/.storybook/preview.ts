import type { Preview } from "@storybook/react";

import "../src/index.css";

const preview: Preview = {
  parameters: {
    // layout: "fullscreen",
    layout: "centered",
    actions: { argTypesRegex: "^on[A-Z].*" },
    // backgrounds: { disable: true },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
