import {injectable} from "inversify";
import {AbstractController} from "../../Base/AbstractController";
import {Table} from "../../../documentation/databases/Table";
import {CalendarMoon} from "../../../entity/CalendarMoon";

@injectable()
export class CalendarMoonController extends AbstractController<CalendarMoon> {
    constructor() {
        super(Table.MOON);
    }

    public async save(moon: CalendarMoon): Promise<CalendarMoon> {
        return this.getRepo().save(moon);
    }
}