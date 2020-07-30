import {CalendarMoonPhaseDTO} from "./CalendarMoonPhaseDTO";

export interface CalendarMoonDTO {
    id: string;
    createdDate: Date;
    updatedDate: Date;
    name: string;
    description?: string;
    cycle: number;
    shift: number;
    phases?: CalendarMoonPhaseDTO[];
}