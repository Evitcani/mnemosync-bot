import {injectable} from "inversify";
import {AbstractController} from "../../Base/AbstractController";
import {Table} from "../../../documentation/databases/Table";
import {CalendarEra} from "../../../entity/CalendarEra";
import {Calendar} from "../../../entity/Calendar";

@injectable()
export class CalendarEraController extends AbstractController<CalendarEra> {
    constructor() {
        super(Table.ERA);
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