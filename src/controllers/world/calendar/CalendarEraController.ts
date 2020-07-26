import {injectable} from "inversify";
import {AbstractController} from "../../Base/AbstractController";
import {Table} from "../../../documentation/databases/Table";
import {CalendarEra} from "../../../entity/CalendarEra";

@injectable()
export class CalendarEraController extends AbstractController<CalendarEra> {
    constructor() {
        super(Table.ERA);
    }

    public async save(era: CalendarEra): Promise<CalendarEra> {
        return this.getRepo().save(era);
    }
}