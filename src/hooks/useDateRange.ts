import { useState, useCallback, useMemo } from 'react';
import { DateTimeRange, SelectionMode, Constraint, Timezone } from '../types';
import { isBefore, isAfter } from '../utils/date-utils';

export const useDateRange = (initialRange?: DateTimeRange, constraints?: Constraint) => {
    const [range, setRange] = useState<DateTimeRange>(initialRange || { start: null, end: null });
    const [selectionMode, setSelectionMode] = useState<SelectionMode>('start');
    const [dstError, setDstError] = useState<string | null>(null);

    const setStart = useCallback((date: Date | null) => {
        setDstError(null);
        setRange(prev => {
            if (date && prev.end && isAfter(date, prev.end)) {
                return { start: date, end: null };
            }
            return { ...prev, start: date };
        });
        setSelectionMode('end');
    }, []);

    const setEnd = useCallback((date: Date | null) => {
        setDstError(null);
        setRange(prev => {
            if (date && prev.start && isBefore(date, prev.start)) {
                return { start: date, end: null };
            }
            return { ...prev, end: date };
        });
    }, []);

    const selectDate = useCallback((date: Date | null, _timeZone: string) => {
        setDstError(null);
        if (date === null) {
            setDstError('Selected time is invalid due to DST transition.');
            return;
        }

        const isSameDate = (d1: Date | null, d2: Date) => d1?.getTime() === d2.getTime();

        setRange(prev => {
            if (isSameDate(prev.start, date)) {
                setTimeout(() => setSelectionMode('start'), 0);
                return { ...prev, start: null };
            }
            if (isSameDate(prev.end, date)) {
                setTimeout(() => setSelectionMode('end'), 0);
                return { ...prev, end: null };
            }

            if (selectionMode === 'start') {
                setTimeout(() => setSelectionMode('end'), 0);
                if (prev.end && isAfter(date, prev.end)) {
                    return { start: date, end: null };
                }
                return { ...prev, start: date };
            } else {
                if (prev.start && isBefore(date, prev.start)) {
                    return { start: date, end: null };
                }
                return { ...prev, end: date };
            }
        });
    }, [selectionMode]);

    const reset = useCallback(() => {
        setRange({ start: null, end: null });
        setSelectionMode('start');
    }, []);

    const validationError = useMemo(() => {
        if (!range.start || !range.end) return null;

        if (constraints?.minDurationMinutes) {
            const diff = (range.end.getTime() - range.start.getTime()) / 60000;
            if (diff < constraints.minDurationMinutes) {
                return `Minimum duration is ${constraints.minDurationMinutes} minutes`;
            }
        }

        if (constraints?.maxDurationMinutes) {
            const diff = (range.end.getTime() - range.start.getTime()) / 60000;
            if (diff > constraints.maxDurationMinutes) {
                return `Maximum duration is ${constraints.maxDurationMinutes} minutes`;
            }
        }

        return null;
    }, [range, constraints]);

    return {
        range,
        selectionMode,
        setSelectionMode,
        selectDate,
        setStart,
        setEnd,
        reset,
        validationError,
        dstError,
        setDstError,
    };
};
