import {injectable} from "inversify";
import {AbstractController} from "../../Base/AbstractController";
import {TableName} from "../../../../shared/documentation/databases/TableName";
import {CalendarMoon} from "../../../entity/calendar/CalendarMoon";
import {Calendar} from "../../../entity/calendar/Calendar";

@injectable()
export class CalendarMoonController extends AbstractController<CalendarMoon> {
    constructor() {
        super(TableName.MOON);
    }

    public async save(moon: CalendarMoon): Promise<CalendarMoon> {
        return this.getRepo().save(moon);
    }

    public async delete(calendar: Calendar): Promise<boolean> {


        return this.getRepo().delete({calendar: calendar})
            .then((res) => {
                console.log(`Deleted ${res.affected} moon rows.`);
                return true;
            })
            .catch((err: Error) => {
                console.log(`Could not delete moons.`);
                console.error(err);
                return false;
            });
    }
}