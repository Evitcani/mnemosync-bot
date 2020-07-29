import {injectable} from "inversify";
import {AbstractController} from "../../Base/AbstractController";
import {Table} from "../../../../shared/documentation/databases/Table";
import {CurrentDate} from "../../../../entity/CurrentDate";

@injectable()
export class CurrentDateController extends AbstractController<CurrentDate> {
    constructor() {
        super(Table.CURRENT_DATE);
    }

    public async save(currentDate: CurrentDate): Promise<CurrentDate> {
        return this.getRepo().save(currentDate);
    }
}