import {injectable} from "inversify";
import {AbstractController} from "../../Base/AbstractController";
import {Table} from "../../../documentation/databases/Table";
import {CalendarMoonPhase} from "../../../entity/CalendarMoonPhase";
import {CalendarMoon} from "../../../entity/CalendarMoon";

@injectable()
export class CalendarMoonPhaseController extends AbstractController<CalendarMoonPhase> {
    constructor() {
        super(Table.MOON_PHASE);
    }

    public async save(phase: CalendarMoonPhase): Promise<CalendarMoonPhase> {
        return this.getRepo().save(phase);
    }

    public async delete(moon: CalendarMoon): Promise<boolean> {
        return this.getRepo().delete({moon: moon})
            .then((res) => {
                console.log(`Deleted ${res.affected} moon phase rows.`);
                return true;
            })
            .catch((err: Error) => {
                console.log(`Could not delete moon phases.`);
                console.error(err);
                return false;
            });
    }
}