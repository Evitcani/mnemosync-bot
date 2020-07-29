import {injectable} from "inversify";
import {AbstractController} from "../../Base/AbstractController";
import {TableName} from "../../../../shared/documentation/databases/TableName";
import {CalendarEra} from "../../../entity/calendar/CalendarEra";
import {Calendar} from "../../../entity/calendar/Calendar";

@injectable()
export class CalendarEraController extends AbstractController<CalendarEra> {
    constructor() {
        super(TableName.ERA);
    }

    public async save(era: CalendarEra): Promise<CalendarEra> {
        return this.getRepo().save(era);
    }

    public async delete(calendar: Calendar): Promise<boolean> {
        return this.getRepo().delete({calendar: calendar})
            .then((res) => {
                console.log(`Deleted ${res.affected} era rows.`);
                return true;
            })
            .catch((err: Error) => {
                console.log(`Could not delete eras.`);
                console.error(err);
                return false;
            });
    }
}