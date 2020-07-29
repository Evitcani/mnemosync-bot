import {WorldAnvilEvent} from "./WorldAnvilEvent";
import {WorldAnvilCelestial} from "./WorldAnvilCelestial";
import {WorldAnvilMonth} from "./WorldAnvilMonth";

export interface WorldAnvilCalendar {
    notes: WorldAnvilEvent[];
    calendarVersion: string;
    name: string;
    description: string;
    daysPerWeek: number;
    monthsPerYear: number;
    monthOffset: number;
    defaultYear: number;
    celestials: WorldAnvilCelestial[];
    celestialBodyCount: number;
    days: string[];
    months: WorldAnvilMonth[];
    startAtZero: boolean;
    showDays: boolean;
}