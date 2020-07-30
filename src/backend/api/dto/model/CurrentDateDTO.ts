import {DateDTO} from "./DateDTO";
import {CalendarDTO} from "./calendar/CalendarDTO";

export interface CurrentDateDTO {
    id?: string;
    createdDate?: Date;
    updatedDate?: Date;
    date?: DateDTO;
    calendar?: CalendarDTO;
}