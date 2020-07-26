import {injectable} from "inversify";
import {AbstractController} from "../../Base/AbstractController";
import {Table} from "../../../documentation/databases/Table";
import {CalendarMonth} from "../../../entity/CalendarMonth";

@injectable()
export class CalendarMonthController extends AbstractController<CalendarMonth> {
    constructor() {
        super(Table.MONTH);
    }

    public async save(month: CalendarMonth): Promise<CalendarMonth> {
        return this.getRepo().save(month);
    }
}