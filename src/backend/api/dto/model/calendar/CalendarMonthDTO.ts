import {DTOType} from "../../DTOType";

export interface CalendarMonthDTO {
    id?: string;
    dtoType: DTOType.CALENDAR_MONTH;
    createdDate?: Date;
    updatedDate?: Date;
    name?: string;
    description?: string;
    length?: number;
    order?: number;
}