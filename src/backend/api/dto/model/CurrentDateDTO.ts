import {DateDTO} from "./DateDTO";
import {DTOType} from "../DTOType";

export interface CurrentDateDTO {
    id?: string;
    dtoType: DTOType.CURRENT_DATE;
    createdDate?: Date;
    updatedDate?: Date;
    date?: DateDTO;
    calendarId?: string;
}