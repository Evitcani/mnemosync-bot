import {injectable} from "inversify";
import {AbstractController} from "../../Base/AbstractController";
import {Table} from "../../../documentation/databases/Table";
import {CalendarMoonPhase} from "../../../entity/CalendarMoonPhase";

@injectable()
export class CalendarMoonPhaseController extends AbstractController<CalendarMoonPhase> {
    constructor() {
        super(Table.MOON_PHASE);
    }

    public async save(phase: CalendarMoonPhase): Promise<CalendarMoonPhase> {
        return this.getRepo().save(phase);
    }
}