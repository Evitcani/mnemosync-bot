import {AbstractController} from "../../Base/AbstractController";
import {Calendar} from "../../../entity/Calendar";
import {Table} from "../../../documentation/databases/Table";
import {injectable} from "inversify";

@injectable()
export class CalendarController extends AbstractController<Calendar> {
    constructor() {
        super(Table.CALENDAR);
    }

    public async save(calendar: Calendar): Promise<Calendar> {
        return this.getRepo().save(calendar);
    }
}