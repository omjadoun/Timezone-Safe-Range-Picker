import React, { useMemo, useRef, useEffect } from 'react';
import { Timezone, DateTimeRange } from '../../types';
import { getDaysInMonth, getFirstDayOfMonth, getDateParts, createDateFromParts, isSameDay } from '../../utils/date-utils';

interface CalendarGridProps {
    year: number;
    month: number;
    timezone: Timezone;
    range: DateTimeRange;
    onSelect: (date: Date) => void;
    focusedDate: Date | null;
    setFocusedDate: (date: Date) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
    year,
    month,
    timezone,
    range,
    onSelect,
    focusedDate,
    setFocusedDate,
}) => {
    const gridRef = useRef<HTMLDivElement>(null);

    const days = useMemo(() => {
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        const cells: (Date | null)[] = [];

        for (let i = 0; i < firstDay; i++) {
            cells.push(null);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const date = createDateFromParts(year, month, i, 12, 0, timezone);
            cells.push(date);
        }

        while (cells.length < 42) {
            cells.push(null);
        }

        return cells;
    }, [year, month, timezone]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!focusedDate) return;

        const parts = getDateParts(focusedDate, timezone);
        let nextDate: Date | null = null;

        switch (e.key) {
            case 'ArrowLeft':
                nextDate = createDateFromParts(parts.year, parts.month, parts.day - 1, 12, 0, timezone);
                break;
            case 'ArrowRight':
                nextDate = createDateFromParts(parts.year, parts.month, parts.day + 1, 12, 0, timezone);
                break;
            case 'ArrowUp':
                nextDate = createDateFromParts(parts.year, parts.month, parts.day - 7, 12, 0, timezone);
                break;
            case 'ArrowDown':
                nextDate = createDateFromParts(parts.year, parts.month, parts.day + 7, 12, 0, timezone);
                break;
            case 'Enter':
            case ' ':
                e.preventDefault();
                onSelect(focusedDate);
                return;
            default:
                return;
        }

        if (nextDate) {
            e.preventDefault();
            setFocusedDate(nextDate);
        }
    };

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div
            className="select-none"
            onKeyDown={handleKeyDown}
            role="grid"
            aria-label="Calendar"
        >
            <div className="grid grid-cols-7 mb-2" role="row">
                {weekDays.map(d => (
                    <div
                        key={d}
                        className="text-center text-xs font-semibold text-gray-400 uppercase tracking-wider h-8 flex items-center justify-center"
                        role="columnheader"
                    >
                        {d}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-y-1" role="presentation">
                {days.map((date, i) => {
                    if (!date) return <div key={`empty-${i}`} role="gridcell" />;

                    const isSelected = (range.start && isSameDay(date, range.start, timezone)) ||
                        (range.end && isSameDay(date, range.end, timezone));

                    const inRange = range.start && range.end &&
                        date.getTime() > range.start.getTime() &&
                        date.getTime() < range.end.getTime();

                    const isFocused = focusedDate && isSameDay(date, focusedDate, timezone);
                    const { day } = getDateParts(date, timezone);

                    return (
                        <div
                            key={date.toISOString()}
                            role="gridcell"
                            aria-selected={isSelected || inRange ? 'true' : 'false'}
                        >
                            <button
                                type="button"
                                onClick={() => onSelect(date)}
                                className={`
                  w-full aspect-square flex items-center justify-center rounded-brand text-sm transition-all focus:outline-none
                  ${isSelected ? 'bg-brand-600 text-white shadow-md' : ''}
                  ${inRange ? 'bg-brand-100 text-brand-900 rounded-none' : ''}
                  ${!isSelected && !inRange ? 'hover:bg-gray-100 text-gray-700' : ''}
                  ${isFocused ? 'ring-2 ring-brand-400 ring-offset-2' : ''}
                `}
                                tabIndex={isFocused ? 0 : -1}
                                aria-label={date.toDateString()}
                            >
                                {day}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
