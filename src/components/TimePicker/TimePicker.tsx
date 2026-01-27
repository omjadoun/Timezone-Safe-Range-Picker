import React, { useRef, useEffect } from 'react';
import { Clock } from '../ui/Icons';

interface TimePickerProps {
    label: string;
    hour: number;
    minute: number;
    onChange: (hour: number, minute: number) => void;
}

export const TimePicker: React.FC<TimePickerProps> = ({ label, hour, minute, onChange }) => {
    const hoursRef = useRef<HTMLDivElement>(null);
    const minutesRef = useRef<HTMLDivElement>(null);

    const handleHourChange = (newHour: number) => {
        onChange((newHour + 24) % 24, minute);
    };

    const handleMinuteChange = (newMinute: number) => {
        onChange(hour, (newMinute + 60) % 60);
    };

    const handleKeyDown = (e: React.KeyboardEvent, type: 'hour' | 'minute') => {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            type === 'hour' ? handleHourChange(hour + 1) : handleMinuteChange(minute + 5);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            type === 'hour' ? handleHourChange(hour - 1) : handleMinuteChange(minute - 5);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {label}
            </div>
            <div className="flex items-center gap-2">
                <div className="flex flex-col items-center">
                    <input
                        type="text"
                        value={String(hour).padStart(2, '0')}
                        onChange={(e) => {
                            const val = parseInt(e.target.value.replace(/[^0-9]/g, ''), 10);
                            if (!isNaN(val) && val >= 0 && val < 24) handleHourChange(val);
                        }}
                        onKeyDown={(e) => handleKeyDown(e, 'hour')}
                        className="w-12 h-10 border rounded-brand text-center text-lg font-medium focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                        aria-label={`${label} hours`}
                    />
                </div>
                <span className="text-xl font-bold text-gray-400">:</span>
                <div className="flex flex-col items-center">
                    <input
                        type="text"
                        value={String(minute).padStart(2, '0')}
                        onChange={(e) => {
                            const val = parseInt(e.target.value.replace(/[^0-9]/g, ''), 10);
                            if (!isNaN(val) && val >= 0 && val < 60) handleMinuteChange(val);
                        }}
                        onKeyDown={(e) => handleKeyDown(e, 'minute')}
                        className="w-12 h-10 border rounded-brand text-center text-lg font-medium focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                        aria-label={`${label} minutes`}
                    />
                </div>
            </div>
        </div>
    );
};
