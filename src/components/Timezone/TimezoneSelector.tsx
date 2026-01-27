import React from 'react';
import { Globe } from '../ui/Icons';
import { Timezone } from '../../types';

interface TimezoneSelectorProps {
    value: Timezone;
    onChange: (tz: Timezone) => void;
}

const COMMON_TIMEZONES = [
    { label: 'UTC', value: 'UTC' },
    { label: 'New York (EST/EDT)', value: 'America/New_York' },
    { label: 'London (GMT/BST)', value: 'Europe/London' },
    { label: 'Tokyo (JST)', value: 'Asia/Tokyo' },
    { label: 'Mumbai (IST)', value: 'Asia/Kolkata' },
    { label: 'San Francisco (PST/PDT)', value: 'America/Los_Angeles' },
];

export const TimezoneSelector: React.FC<TimezoneSelectorProps> = ({ value, onChange }) => {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <Globe className="w-3 h-3" />
                Timezone
            </label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full h-10 px-3 border rounded-brand border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none bg-white text-sm"
                aria-label="Select timezone"
            >
                {COMMON_TIMEZONES.map(tz => (
                    <option key={tz.value} value={tz.value}>
                        {tz.label}
                    </option>
                ))}
            </select>
        </div>
    );
};
