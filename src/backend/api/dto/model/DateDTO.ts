import {DTOType} from "../DTOType";

export interface DateDTO {
    id?: string;
    dtoType: DTOType.DATE;
    name?: string;
    description?: string;
    recurrence?: string;
    day?: number;
    month?: number;
    year?: number;
    calendarId?: string;
    eraId?: string;
}