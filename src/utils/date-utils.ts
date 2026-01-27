export const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
};

export const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
};

/**
 * Returns a date parts object for a given date in a specific timezone.
 */
export const getDateParts = (date: Date, timeZone: string) => {
    // Force 24-hour clock and specific locale for stable parsing
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone,
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false,
    });

    const parts = formatter.formatToParts(date);
    const m: Record<string, string> = {};
    parts.forEach(p => { m[p.type] = p.value; });

    // Handle potential '24' for midnight in some environments
    let hour = parseInt(m.hour || '0', 10);
    if (hour === 24) hour = 0;

    return {
        year: parseInt(m.year || '0', 10),
        month: parseInt(m.month || '1', 10) - 1, // 0-indexed
        day: parseInt(m.day || '1', 10),
        hour,
        minute: parseInt(m.minute || '0', 10),
        second: parseInt(m.second || '0', 10),
    };
};

/**
 * Creates a Date object from parts interpreted in a specific timezone.
 * Uses iterative refinement to handle DST transitions correctly.
 */
export const createDateFromParts = (
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number,
    timeZone: string
): Date | null => {
    const dates = findAllDatesForParts(year, month, day, hour, minute, timeZone);
    return dates.length > 0 ? dates[0]! : null;
};

/**
 * Finds all possible Date objects that map to the same local wall-clock time.
 * This handles "fall back" DST transitions where the same time occurs twice.
 */
export const findAllDatesForParts = (
    year: number,
    month: number,
    day: number,
    hour: number,
    minute: number,
    timeZone: string
): Date[] => {
    const results: Date[] = [];
    const baseMs = Date.UTC(year, month, day, hour, minute);

    // Test multiple starting offsets from -14h to +14h in 30-min increments
    // to ensure we land in all possible candidate windows for refinement.
    const seen = new Set<number>();

    for (let offsetH = -14; offsetH <= 14; offsetH += 0.5) {
        let candidate = new Date(baseMs - offsetH * 60 * 60 * 1000);

        // Refine the candidate to match the target wall-clock
        for (let i = 0; i < 3; i++) {
            const actual = getDateParts(candidate, timeZone);
            const actualMs = Date.UTC(actual.year, actual.month, actual.day, actual.hour, actual.minute);
            const diffMs = baseMs - actualMs;
            if (diffMs === 0) break;
            candidate = new Date(candidate.getTime() + diffMs);
        }

        const v = getDateParts(candidate, timeZone);
        if (
            v.year === year &&
            v.month === month &&
            v.day === day &&
            v.hour === hour &&
            v.minute === minute
        ) {
            const ts = candidate.getTime();
            if (!seen.has(ts)) {
                results.push(candidate);
                seen.add(ts);
            }
        }
    }

    return results.sort((a, b) => a.getTime() - b.getTime());
};

export const isSameDay = (d1: Date, d2: Date, timeZone: string) => {
    const p1 = getDateParts(d1, timeZone);
    const p2 = getDateParts(d2, timeZone);
    return p1.year === p2.year && p1.month === p2.month && p1.day === p2.day;
};

export const isAfter = (d1: Date, d2: Date) => d1.getTime() > d2.getTime();
export const isBefore = (d1: Date, d2: Date) => d1.getTime() < d2.getTime();

export const formatDisplayDate = (date: Date, timeZone: string) => {
    return date.toLocaleString('en-US', {
        timeZone,
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
};
