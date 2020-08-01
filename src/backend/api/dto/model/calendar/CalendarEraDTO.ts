import {DateDTO} from "../DateDTO";
import {DTOType} from "../../DTOType";

export class CalendarEraDTO {
    id?: string;
    dtoType: DTOType.CALENDAR_ERA;
    createdDate?: Date;
    updatedDate?: Date;
    name?: string;
    order?: number;
    start?: DateDTO;
    end?: DateDTO;
}