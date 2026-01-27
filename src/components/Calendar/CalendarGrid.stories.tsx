import type { Meta, StoryObj } from '@storybook/react';
import { CalendarGrid } from './CalendarGrid';
import { useState } from 'react';

const meta: Meta<typeof CalendarGrid> = {
    title: 'Components/Sub/CalendarGrid',
    component: CalendarGrid,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CalendarGrid>;

const InteractiveTemplate = (args: any) => {
    const [range, setRange] = useState(args.range);
    const [focusedDate, setFocusedDate] = useState<Date | null>(args.focusedDate);

    return (
        <div className="p-4 border border-gray-100 rounded-2xl shadow-sm w-[320px] bg-white">
            <CalendarGrid
                {...args}
                range={range}
                onSelect={(d) => {
                    setRange((prev: any) => ({ ...prev, start: d }));
                    args.onSelect(d);
                }}
                focusedDate={focusedDate}
                setFocusedDate={setFocusedDate}
            />
        </div>
    );
};

export const Default: Story = {
    args: {
        year: 2026,
        month: 2, // March
        timezone: 'America/New_York',
        range: { start: null, end: null },
        focusedDate: new Date(2026, 2, 1),
    },
    render: (args) => <InteractiveTemplate {...args} />,
};

export const SelectedRange: Story = {
    args: {
        year: 2026,
        month: 2,
        timezone: 'America/New_York',
        range: {
            start: new Date(2026, 2, 10, 12, 0),
            end: new Date(2026, 2, 15, 12, 0)
        },
        focusedDate: new Date(2026, 2, 10),
    },
    render: (args) => <InteractiveTemplate {...args} />,
};
