import {injectable} from "inversify";
import {AbstractController} from "../../Base/AbstractController";
import {Table} from "../../../documentation/databases/Table";
import {CalendarWeekDay} from "../../../entity/CalendarWeekDay";
import {Calendar} from "../../../entity/Calendar";

@injectable()
export class CalendarWeekDayController extends AbstractController<CalendarWeekDay> {
    constructor() {
        super(Table.WEEK_DAY);
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