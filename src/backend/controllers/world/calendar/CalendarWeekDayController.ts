import {injectable} from "inversify";
import {AbstractController} from "../../Base/AbstractController";
import {TableName} from "../../../../shared/documentation/databases/TableName";
import {CalendarWeekDay} from "../../../entity/calendar/CalendarWeekDay";
import {Calendar} from "../../../entity/calendar/Calendar";

@injectable()
export class CalendarWeekDayController extends AbstractController<CalendarWeekDay> {
    constructor() {
        super(TableName.WEEK_DAY);
    }

    public async save(weekDay: CalendarWeekDay): Promise<CalendarWeekDay> {
        return this.getRepo().save(weekDay);
    }

    public async delete(calendar: Calendar): Promise<boolean> {
        return this.getRepo().delete({calendar: calendar})
            .then((res) => {
                console.log(`Deleted ${res.affected} week day rows.`);
                return true;
            })
            .catch((err: Error) => {
                console.log(`Could not delete week days.`);
                console.error(err);
                return false;
            });
    }
}