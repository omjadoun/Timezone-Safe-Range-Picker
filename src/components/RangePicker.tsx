import React, { useState, useRef, useEffect, useMemo } from 'react';
import { CalendarIcon, ChevronLeft, ChevronRight, Clock } from './ui/Icons';
import { useDateRange } from '../hooks/useDateRange';
import { CalendarGrid } from './Calendar/CalendarGrid';
import { TimePicker } from './TimePicker/TimePicker';
import { TimezoneSelector } from './Timezone/TimezoneSelector';
import { RangePickerPresets } from './RangePickerPresets';
import { formatDisplayDate, getDateParts, createDateFromParts, findAllDatesForParts } from '../utils/date-utils';
import { Timezone, Constraint } from '../types';

interface RangePickerProps {
    timezone?: Timezone;
    onTimezoneChange?: (tz: Timezone) => void;
    constraints?: Constraint;
}

export const RangePicker: React.FC<RangePickerProps> = ({
    timezone: externalTimezone,
    onTimezoneChange,
    constraints
}) => {
    const [internalTimezone, setInternalTimezone] = useState<Timezone>(() => {
        try {
            return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
        } catch {
            return 'UTC';
        }
    });
    const timezone = externalTimezone || internalTimezone;

    const [isOpen, setIsOpen] = useState(false);
    const {
        range,
        selectionMode,
        setSelectionMode,
        selectDate,
        setStart,
        setEnd,
        reset,
        validationError,
        dstError,
        setDstError
    } = useDateRange(undefined, constraints);

    // Month navigation state
    const [viewMonth, setViewMonth] = useState(() => {
        const now = new Date();
        const parts = getDateParts(now, timezone);
        return { year: parts.year, month: parts.month };
    });

    // Focus management
    const [focusedDate, setFocusedDate] = useState<Date | null>(() => {
        const now = new Date();
        const p = getDateParts(now, timezone);
        return createDateFromParts(p.year, p.month, 1, 12, 0, timezone);
    });

    // State for ambiguous DST choice
    const [ambiguousInfo, setAmbiguousInfo] = useState<{
        options: Date[];
        mode: 'start' | 'end';
        label: string;
    } | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const monthName = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' })
        .format(new Date(viewMonth.year, viewMonth.month));

    const changeMonth = (delta: number) => {
        setViewMonth(prev => {
            let nm = prev.month + delta;
            let ny = prev.year;
            if (nm < 0) { nm = 11; ny--; }
            if (nm > 11) { nm = 0; ny++; }
            return { year: ny, month: nm };
        });
    };

    const handleDateSelect = (date: Date) => {
        const parts = getDateParts(date, timezone);
        const existingDate = selectionMode === 'start' ? range.start : range.end;

        let hour = 12;
        let minute = 0;

        if (existingDate) {
            const eParts = getDateParts(existingDate, timezone);
            hour = eParts.hour;
            minute = eParts.minute;
        }

        const dates = findAllDatesForParts(parts.year, parts.month, parts.day, hour, minute, timezone);

        if (dates.length > 1) {
            setAmbiguousInfo({
                options: dates,
                mode: selectionMode,
                label: `${monthName.split(' ')[0]} ${parts.day}, ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
            });
        } else {
            selectDate(dates[0] || null, timezone);
        }
    };

    const updateTime = (mode: 'start' | 'end', h: number, m: number) => {
        const baseDate = mode === 'start' ? range.start : range.end;
        if (!baseDate) return;

        setDstError(null);
        const parts = getDateParts(baseDate, timezone);
        const dates = findAllDatesForParts(parts.year, parts.month, parts.day, h, m, timezone);

        if (dates.length > 1) {
            setAmbiguousInfo({
                options: dates,
                mode,
                label: `${monthName.split(' ')[0]} ${parts.day}, ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
            });
        } else if (dates.length === 1) {
            mode === 'start' ? setStart(dates[0]!) : setEnd(dates[0]!);
        } else {
            setDstError('This specific time does not exist in this timezone (DST gap).');
        }
    };

    const handleTimezoneChange = (tz: Timezone) => {
        if (onTimezoneChange) onTimezoneChange(tz);
        else setInternalTimezone(tz);
    };

    return (
        <div className="relative inline-block text-left" ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center gap-3 px-4 py-2 border border-gray-300 rounded-brand shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all min-w-[320px]"
                aria-haspopup="grid"
                aria-expanded={isOpen}
            >
                <CalendarIcon className="w-4 h-4 text-gray-400" />
                <span className="flex-1 text-left flex items-center gap-2">
                    {range.start ? (
                        <span className="text-gray-900 font-semibold">
                            {formatDisplayDate(range.start, timezone)}
                            {range.end ? (
                                <>
                                    <span className="mx-2 text-gray-300 font-normal">→</span>
                                    {formatDisplayDate(range.end, timezone)}
                                </>
                            ) : (
                                <span className="ml-2 text-brand-500 animate-pulse font-normal">(select end)</span>
                            )}
                        </span>
                    ) : (
                        <span className="text-gray-400">Select date range...</span>
                    )}
                    <span className="ml-auto px-1.5 py-0.5 bg-gray-100 text-[10px] text-gray-400 rounded-brand font-mono uppercase tracking-tighter">
                        {timezone.split('/').pop()?.replace('_', ' ')}
                    </span>
                </span>
            </button>

            {isOpen && (
                <div
                    className="absolute z-50 mt-2 w-[400px] bg-white rounded-brand shadow-2xl border border-gray-200 p-6 flex flex-col gap-5"
                    role="dialog"
                    aria-label="Date and time range picker"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => changeMonth(-1)}
                            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="Previous month"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <h2 className="text-sm font-bold text-gray-900 tracking-tight">
                            {monthName}
                        </h2>
                        <button
                            onClick={() => changeMonth(1)}
                            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="Next month"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>

                    {/* Grid */}
                    <CalendarGrid
                        year={viewMonth.year}
                        month={viewMonth.month}
                        timezone={timezone}
                        range={range}
                        onSelect={handleDateSelect}
                        focusedDate={focusedDate}
                        setFocusedDate={setFocusedDate}
                    />

                    <hr className="border-gray-100" />

                    {/* Time & Timezone */}
                    <div className="grid grid-cols-2 gap-4">
                        <TimePicker
                            label="Start"
                            hour={range.start ? getDateParts(range.start, timezone).hour : 12}
                            minute={range.start ? getDateParts(range.start, timezone).minute : 0}
                            onChange={(h, m) => updateTime('start', h, m)}
                        />
                        <TimePicker
                            label="End"
                            hour={range.end ? getDateParts(range.end, timezone).hour : 12}
                            minute={range.end ? getDateParts(range.end, timezone).minute : 0}
                            onChange={(h, m) => updateTime('end', h, m)}
                        />
                    </div>

                    <TimezoneSelector value={timezone} onChange={handleTimezoneChange} />

                    <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Presets</span>
                        <RangePickerPresets
                            timezone={timezone}
                            currentRange={range}
                            onSelect={(r) => {
                                if (r === null) {
                                    reset();
                                } else {
                                    if (r.start) setStart(r.start);
                                    if (r.end) setEnd(r.end);
                                }
                            }}
                        />
                    </div>

                    {/* Ambiguity Selection Overlay */}
                    {ambiguousInfo && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-md rounded-2xl z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
                            <div className="bg-white border-2 border-brand-500 rounded-brand p-6 shadow-2xl max-w-[280px] w-full animate-in zoom-in-95 duration-200">
                                <div className="w-10 h-10 bg-brand-50 rounded-full flex items-center justify-center mb-4 mx-auto">
                                    <Clock className="w-5 h-5 text-brand-600" />
                                </div>
                                <h3 className="text-xs font-black text-brand-600 uppercase tracking-widest mb-2 text-center">
                                    Ambiguous Time
                                </h3>
                                <p className="text-[11px] text-gray-500 mb-5 leading-relaxed text-center">
                                    <span className="font-bold text-gray-900">{ambiguousInfo.label}</span> occurs twice. Please select one:
                                </p>
                                <div className="flex flex-col gap-2">
                                    {ambiguousInfo.options.map((option, idx) => {
                                        const isAfter = idx > 0;
                                        // Simple way to get the shortcut (e.g., EST or EDT)
                                        const tzLabel = option.toLocaleString('en-US', { timeZone: timezone, timeZoneName: 'short' }).split(' ').pop();
                                        return (
                                            <button
                                                key={option.getTime()}
                                                onClick={() => {
                                                    if (ambiguousInfo.mode === 'start') setStart(option);
                                                    else setEnd(option);
                                                    setAmbiguousInfo(null);
                                                }}
                                                className="w-full px-4 py-3 text-left border border-gray-100 rounded-brand bg-white hover:border-brand-300 hover:bg-brand-50 transition-all group shadow-sm flex items-center justify-between"
                                            >
                                                <div>
                                                    <div className="text-[11px] font-bold text-gray-900 group-hover:text-brand-700">
                                                        {isAfter ? 'Second' : 'First'} Occurrence
                                                    </div>
                                                    <div className="text-[9px] text-gray-400 font-mono uppercase">
                                                        {isAfter ? 'Standard Time' : 'Daylight Saving'}
                                                    </div>
                                                </div>
                                                <span className="text-[10px] font-black text-brand-500 bg-brand-50 px-1.5 py-0.5 rounded uppercase">
                                                    {tzLabel}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                                <button
                                    onClick={() => setAmbiguousInfo(null)}
                                    className="mt-5 w-full text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase tracking-[0.2em] py-1 text-center"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {validationError && (
                        <div className="p-3 bg-red-50 border border-red-100 rounded-brand text-[11px] text-red-600 font-semibold flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                            {validationError}
                        </div>
                    )}

                    {dstError && (
                        <div className="p-3 bg-amber-50 border border-amber-100 rounded-brand text-[11px] text-amber-700 font-semibold flex items-center gap-2 animate-pulse">
                            <span className="w-2 h-2 bg-amber-500 rounded-full" />
                            {dstError}
                        </div>
                    )}

                    <div className="flex justify-between items-center pt-2 gap-4">
                        <button
                            onClick={reset}
                            className="px-4 py-2 text-[10px] font-black text-gray-400 hover:text-red-500 uppercase tracking-[0.2em] transition-colors"
                        >
                            Reset
                        </button>
                        <div className="flex p-1 bg-gray-50 rounded-brand border border-gray-100 flex-1 justify-center">
                            <button
                                onClick={() => setSelectionMode('start')}
                                className={`px-3 py-1.5 text-[11px] font-bold rounded-brand transition-all ${selectionMode === 'start' ? 'bg-white text-brand-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                START
                            </button>
                            <button
                                onClick={() => setSelectionMode('end')}
                                className={`px-3 py-1.5 text-[11px] font-bold rounded-brand transition-all ${selectionMode === 'end' ? 'bg-white text-brand-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                END
                            </button>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="px-6 py-2 text-xs font-black bg-brand-600 text-white rounded-brand hover:bg-brand-700 transition-all shadow-lg shadow-brand-100 uppercase tracking-widest hover:-translate-y-0.5"
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
