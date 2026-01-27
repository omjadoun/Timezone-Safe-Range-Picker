import type { Meta, StoryObj } from '@storybook/react';
import { TimezoneSelector } from './TimezoneSelector';
import { useState } from 'react';
import { Timezone } from '../../types';

const meta: Meta<typeof TimezoneSelector> = {
    title: 'Components/Sub/TimezoneSelector',
    component: TimezoneSelector,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TimezoneSelector>;

const InteractiveTemplate = (args: any) => {
    const [tz, setTz] = useState<Timezone>(args.value);

    return (
        <div className="p-6 border border-gray-100 rounded-2xl shadow-sm bg-white w-[300px]">
            <TimezoneSelector
                {...args}
                value={tz}
                onChange={(newTz) => {
                    setTz(newTz);
                    args.onChange(newTz);
                }}
            />
            <div className="mt-4 text-[10px] text-gray-400 font-mono text-center">
                Active ID: {tz}
            </div>
        </div>
    );
};

export const Default: Story = {
    args: {
        value: 'UTC',
    },
    render: (args) => <InteractiveTemplate {...args} />,
};

export const Preselected: Story = {
    args: {
        value: 'America/New_York',
    },
    render: (args) => <InteractiveTemplate {...args} />,
};
