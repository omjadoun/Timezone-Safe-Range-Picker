import type { Meta, StoryObj } from '@storybook/react';
import { RangePickerPresets } from './RangePickerPresets';
import { useState } from 'react';
import { DateTimeRange } from '../types';

const meta: Meta<typeof RangePickerPresets> = {
    title: 'Components/Sub/RangePickerPresets',
    component: RangePickerPresets,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof RangePickerPresets>;

const InteractiveTemplate = (args: any) => {
    const [range, setRange] = useState<DateTimeRange>({ start: null, end: null });

    return (
        <div className="p-6 border border-gray-100 rounded-2xl shadow-sm bg-white min-w-[300px]">
            <RangePickerPresets
                {...args}
                currentRange={range}
                onSelect={(r) => {
                    setRange(r || { start: null, end: null });
                    args.onSelect(r);
                }}
            />
            <div className="mt-6 p-3 bg-gray-50 rounded-brand border border-gray-100 space-y-1">
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Current Range:</div>
                <div className="text-[11px] font-mono text-gray-600 truncate">
                    {range.start?.toISOString() || 'null'} — {range.end?.toISOString() || 'null'}
                </div>
            </div>
        </div>
    );
};

export const Default: Story = {
    args: {
        timezone: 'UTC',
    },
    render: (args) => <InteractiveTemplate {...args} />,
};

export const NewYork: Story = {
    args: {
        timezone: 'America/New_York',
    },
    render: (args) => <InteractiveTemplate {...args} />,
};
