import type { Preview } from "@storybook/react";
import '../src/index.css';

const preview: Preview = {
    parameters: {
        actions: { argTypesRegex: "^on[A-Z].*" },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
        a11y: {
            config: {},
            options: {
                checks: { 'color-contrast': { options: { noLayout: true } } },
                restoreScroll: true,
            },
        },
    },
};

export default preview;
