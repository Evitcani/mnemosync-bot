import {CalendarMoonPhaseDTO} from "./CalendarMoonPhaseDTO";
import {DTOType} from "../../DTOType";

export interface CalendarMoonDTO {
    id?: string;
    dtoType: DTOType.CALENDAR_MOON;
    createdDate?: Date;
    updatedDate?: Date;
    name?: string;
    description?: string;
    cycle?: number;
    shift?: number;
    phases?: CalendarMoonPhaseDTO[];
}