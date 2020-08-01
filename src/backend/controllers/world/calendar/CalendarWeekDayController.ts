import {injectable} from "inversify";
import {TableName} from "../../../../shared/documentation/databases/TableName";
import {API} from "../../../api/controller/base/API";
import {CalendarWeekDayDTO} from "../../../api/dto/model/calendar/CalendarWeekDayDTO";

@injectable()
export class CalendarWeekDayController extends API {
    constructor() {
        super(TableName.WEEK_DAY);
    }

    public async save(weekDay: CalendarWeekDayDTO): Promise<CalendarWeekDayDTO> {
        return this.getRepo().save(weekDay);
    }

    public async delete(calendar: CalendarWeekDayDTO): Promise<boolean> {
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