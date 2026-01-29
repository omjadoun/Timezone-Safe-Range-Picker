import type { Meta, StoryObj } from '@storybook/react';
import { RangePicker } from './RangePicker';

const meta: Meta<typeof RangePicker> = {
    title: 'Components/RangePicker',
    component: RangePicker,
    parameters: {
        layout: 'centered',
        a11y: {
            config: {
                rules: [
                    { id: 'color-contrast', enabled: true },
                ],
            },
        },
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof RangePicker>;

export const Default: Story = {
    args: {},
};

export const WithConstraints: Story = {
    args: {
        constraints: {
            minDurationMinutes: 60,
            maxDurationMinutes: 1440, // 24 hours
        },
    },
};

export const SpringForwardGap: Story = {
    args: {
        timezone: 'America/New_York',
    },
    parameters: {
        docs: {
            description: {
                story: 'Demonstrates the DST "Gap" handling. Navigate to March 8, 2026, and try to set the time to 02:30 AM. The picker will display an explicit message explaining that this time does not exist due to the spring-forward transition.',
            },
        },
    },
};

export const FallBackAmbiguity: Story = {
    args: {
        timezone: 'America/New_York',
    },
    parameters: {
        docs: {
            description: {
                story: 'Demonstrates Option A: Choice Modal for ambiguous times. Navigate to November 2, 2025, and select 01:30 AM. A centered overlay will appear, asking you to choose between the DST and Standard Time occurrences.',
            },
        },
    },
};

export const KeyboardFlow: Story = {
    args: {},
    parameters: {
        docs: {
            description: {
                story: 'Use Tab to focus the picker, Enter to open, Arrows to navigate the grid, Enter to select, and Tab to move between Start/End times.',
            }
        }
    }
}

export const Loading: Story = {
    args: {
        isLoading: true,
    },
};

export const HighContrast: Story = {
    args: {
        highContrast: true,
    },
    parameters: {
        docs: {
            description: {
                story: 'Demonstrates the High-contrast mode for accessibility.',
            }
        }
    }
}
