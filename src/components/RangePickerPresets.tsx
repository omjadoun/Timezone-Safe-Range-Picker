import React from 'react';
import { Timezone, DateTimeRange, Preset } from '../types';
import { createDateFromParts, getDateParts } from '../utils/date-utils';

interface RangePickerPresetsProps {
    onSelect: (range: DateTimeRange | null) => void;
    timezone: Timezone;
    currentRange: DateTimeRange;
}

export const RangePickerPresets: React.FC<RangePickerPresetsProps> = ({ onSelect, timezone, currentRange }) => {
    const getPresets = (): Preset[] => [
        {
            label: 'Today',
            getValue: (tz) => {
                const now = new Date();
                const p = getDateParts(now, tz);
                const start = createDateFromParts(p.year, p.month, p.day, 0, 0, tz);
                const end = createDateFromParts(p.year, p.month, p.day, 23, 59, tz);
                return { start, end };
            }
        },
        {
            label: 'Last 7 Days',
            getValue: (tz) => {
                const now = new Date();
                const p = getDateParts(now, tz);
                const end = createDateFromParts(p.year, p.month, p.day, 23, 59, tz);

                // Subtract 7 days
                const startBase = new Date(now.getTime() - 7 * 24 * 3600 * 1000);
                const ps = getDateParts(startBase, tz);
                const start = createDateFromParts(ps.year, ps.month, ps.day, 0, 0, tz);
                return { start, end };
            }
        },
        {
            label: 'Next 24 Hours',
            getValue: (tz) => {
                const start = new Date();
                const end = new Date(start.getTime() + 24 * 3600 * 1000);
                return { start, end };
            }
        }
    ];

    return (
        <div className="flex flex-wrap gap-2">
            {getPresets().map(preset => {
                const val = preset.getValue(timezone);
                const isActive = currentRange.start?.getTime() === val.start?.getTime() &&
                    currentRange.end?.getTime() === val.end?.getTime();

                return (
                    <button
                        key={preset.label}
                        onClick={() => onSelect(isActive ? null : val)}
                        className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border transition-all ${isActive
                                ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                                : 'bg-brand-50 text-brand-700 border-brand-100 hover:bg-brand-100'
                            }`}
                    >
                        {preset.label}
                    </button>
                );
            })}
        </div>
    );
};
