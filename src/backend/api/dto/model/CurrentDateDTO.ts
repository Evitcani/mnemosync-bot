import {DateDTO} from "./DateDTO";
import {CalendarDTO} from "./calendar/CalendarDTO";
import {PartyDTO} from "./PartyDTO";
import {DTOType} from "../DTOType";

export interface CurrentDateDTO {
    id?: string;
    dtoType: DTOType.CURRENT_DATE;
    createdDate?: Date;
    updatedDate?: Date;
    date?: DateDTO;
    calendarId?: string;
}