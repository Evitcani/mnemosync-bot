import {injectable} from "inversify";
import {AbstractController} from "../../Base/AbstractController";
import {TableName} from "../../../../shared/documentation/databases/TableName";
import {CalendarMonth} from "../../../entity/calendar/CalendarMonth";
import {Calendar} from "../../../entity/calendar/Calendar";

@injectable()
export class CalendarMonthController extends AbstractController<CalendarMonth> {
    constructor() {
        super(TableName.MONTH);
    }

    public async save(month: CalendarMonth): Promise<CalendarMonth> {
        return this.getRepo().save(month);
    }

    public async delete(calendar: Calendar): Promise<boolean> {
        return this.getRepo().delete({calendar: calendar})
            .then((res) => {
                console.log(`Deleted ${res.affected} month rows.`);
                return true;
            })
            .catch((err: Error) => {
                console.log(`Could not delete months.`);
                console.error(err);
                return false;
            });
    }
}