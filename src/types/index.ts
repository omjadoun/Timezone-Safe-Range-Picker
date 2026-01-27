export type Timezone = string;

export interface DateTimeRange {
    start: Date | null;
    end: Date | null;
}

export interface CalendarMonth {
    year: number;
    month: number; // 0-indexed
}

export type SelectionMode = 'start' | 'end';

export interface Constraint {
    minDate?: Date;
    maxDate?: Date;
    blackoutDates?: Date[];
    minDurationMinutes?: number;
    maxDurationMinutes?: number;
}

export interface Preset {
    label: string;
    getValue: (tz: Timezone) => DateTimeRange;
}
