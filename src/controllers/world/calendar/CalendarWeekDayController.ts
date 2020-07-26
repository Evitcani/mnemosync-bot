import {injectable} from "inversify";
import {AbstractController} from "../../Base/AbstractController";
import {Table} from "../../../documentation/databases/Table";
import {CalendarWeekDay} from "../../../entity/CalendarWeekDay";

@injectable()
export class CalendarWeekDayController extends AbstractController<CalendarWeekDay> {
    constructor() {
        super(Table.WEEK_DAY);
    }

    public async save(weekDay: CalendarWeekDay): Promise<CalendarWeekDay> {
        return this.getRepo().save(weekDay);
    }
}