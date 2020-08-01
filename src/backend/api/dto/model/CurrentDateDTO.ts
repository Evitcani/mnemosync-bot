import {DateDTO} from "./DateDTO";
import {DTOType} from "../DTOType";
import {CalendarDTO} from "./calendar/CalendarDTO";

export interface CurrentDateDTO {
    id?: string;
    dtoType: DTOType.CURRENT_DATE;
    createdDate?: Date;
    updatedDate?: Date;
    date?: DateDTO;
    calendar?: CalendarDTO;
}