import { useState, useCallback } from 'react';

const STORAGE_KEY = 'rms_booking_chart_options';

export const DEFAULT_CHART_OPTIONS = {
    allowHorizontalMove: false,
    excludeReservationTimes: false,
    repositionChart: false,
    showAreaDescription: true,
    showElectricityIndicator: false,
    showHousekeepingStatus: true,
    showRoomTypeDescription: true,
    showSpecialEventRow: true,
    showTariffPeriodColors: false,
    showPropertyOccupancyRow: false,
    showRateCreatingReservation: true,
    showPaxRow: false,
    showUnallocatedReservation: false,
    hideOutOfOrderArea: false,
    areaHeight: 'Small',
    areaWidth: '125',
    colorBy: 'Reservation Status',
    columnViewBy: 'Day',
    dayView: '30',
    viewBy: 'Area (by Room Type Display Order)',
    hourStart: '0:00',
    hourEnd: '24:00',
    textLabel: 'Surname',
};

const loadFromStorage = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? { ...DEFAULT_CHART_OPTIONS, ...JSON.parse(stored) } : { ...DEFAULT_CHART_OPTIONS };
    } catch {
        return { ...DEFAULT_CHART_OPTIONS };
    }
};

const saveToStorage = (settings) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        return true;
    } catch {
        return false;
    }
};

export const useChartOptions = () => {
    const [options, setOptions] = useState(() => loadFromStorage());

    const saveOptions = useCallback((newOptions) => {
        setOptions(newOptions);
        return saveToStorage(newOptions);
    }, []);

    const restoreDefaults = useCallback(() => {
        const defaults = { ...DEFAULT_CHART_OPTIONS };
        setOptions(defaults);
        localStorage.removeItem(STORAGE_KEY);
        return defaults;
    }, []);

    return { options, setOptions, saveOptions, restoreDefaults };
};
