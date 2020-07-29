import {injectable} from "inversify";
import {AbstractController} from "../../Base/AbstractController";
import {Table} from "../../../../shared/documentation/databases/Table";
import {CalendarMonth} from "../../../../entity/CalendarMonth";
import {Calendar} from "../../../../entity/Calendar";

@injectable()
export class CalendarMonthController extends AbstractController<CalendarMonth> {
    constructor() {
        super(Table.MONTH);
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