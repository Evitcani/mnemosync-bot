import {DateDTO} from "../DateDTO";

export class CalendarEraDTO {
    id: string;
    createdDate: Date;
    updatedDate: Date;
    name: string;
    order: number;
    start: DateDTO;
    end?: DateDTO;
}