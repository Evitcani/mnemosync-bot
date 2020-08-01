import {DTOType} from "../../DTOType";

export interface CalendarMoonPhaseDTO {
    id?: string;
    dtoType: DTOType.CALENDAR_MOON_PHASE;
    createdDate?: Date;
    updatedDate?: Date;
    name?: string;
    order?: number;
    viewingAngleStart?: number;
    viewingAngleEnd?: number;
}