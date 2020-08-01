import {DateDTO} from "../DateDTO";
import {CalendarEraDTO} from "./CalendarEraDTO";
import {CalendarMonthDTO} from "./CalendarMonthDTO";
import {CalendarWeekDayDTO} from "./CalendarWeekDayDTO";
import {CalendarMoonDTO} from "./CalendarMoonDTO";
import {WorldDTO} from "../WorldDTO";
import {DTOType} from "../../DTOType";

export class CalendarDTO {
    id?: string;
    dtoType: DTOType.CALENDAR;
    createdDate?: Date;
    updatedDate?: Date;
    name?: string;
    yearLength?: number;
    description?: string;
    worldId?: string;
    epoch?: DateDTO;
    eras?: CalendarEraDTO[];
    months?: CalendarMonthDTO[];
    week?: CalendarWeekDayDTO[];
    moons?: CalendarMoonDTO[];
}