import type { Meta, StoryObj } from '@storybook/react';
import { TimePicker } from './TimePicker';
import { useState } from 'react';

const meta: Meta<typeof TimePicker> = {
    title: 'Components/Sub/TimePicker',
    component: TimePicker,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TimePicker>;

const InteractiveTemplate = (args: any) => {
    const [hour, setHour] = useState(args.hour);
    const [minute, setMinute] = useState(args.minute);

    return (
        <div className="p-6 border border-gray-100 rounded-2xl shadow-sm bg-white min-w-[200px]">
            <TimePicker
                {...args}
                hour={hour}
                minute={minute}
                onChange={(h, m) => {
                    setHour(h);
                    setMinute(m);
                    args.onChange(h, m);
                }}
            />
            <div className="mt-4 text-[10px] text-gray-400 font-mono text-center">
                Current: {String(hour).padStart(2, '0')}:{String(minute).padStart(2, '0')}
            </div>
        </div>
    );
};

export const Default: Story = {
    args: {
        label: 'Arrival Time',
        hour: 14,
        minute: 30,
    },
    render: (args) => <InteractiveTemplate {...args} />,
};

export const Midnight: Story = {
    args: {
        label: 'Start of Day',
        hour: 0,
        minute: 0,
    },
    render: (args) => <InteractiveTemplate {...args} />,
};
