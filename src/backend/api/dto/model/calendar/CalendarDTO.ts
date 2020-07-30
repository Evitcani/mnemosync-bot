import {DateDTO} from "../DateDTO";
import {CalendarEraDTO} from "./CalendarEraDTO";
import {CalendarMonthDTO} from "./CalendarMonthDTO";
import {CalendarWeekDayDTO} from "./CalendarWeekDayDTO";
import {CalendarMoonDTO} from "./CalendarMoonDTO";

export class CalendarDTO {
    id?: string;
    createdDate?: Date;
    updatedDate?: Date;
    name?: string;
    yearLength?: number;
    description?: string;
    epoch?: DateDTO;
    eras?: CalendarEraDTO[];
    months?: CalendarMonthDTO[];
    week?: CalendarWeekDayDTO[];
    moons?: CalendarMoonDTO[];
}