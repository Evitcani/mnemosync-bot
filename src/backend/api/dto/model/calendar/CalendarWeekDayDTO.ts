import {DTOType} from "../../DTOType";

export interface CalendarWeekDayDTO {
    id?: string;
    dtoType: DTOType.CALENDAR_WEEK_DAY;
    createdDate?: Date;
    updatedDate?: Date;
    name?: string;
    description?: string;
    order?: number;
}