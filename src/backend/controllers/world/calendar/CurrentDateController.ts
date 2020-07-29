import {injectable} from "inversify";
import {AbstractController} from "../../Base/AbstractController";
import {TableName} from "../../../../shared/documentation/databases/TableName";
import {CurrentDate} from "../../../entity/CurrentDate";

@injectable()
export class CurrentDateController extends AbstractController<CurrentDate> {
    constructor() {
        super(TableName.CURRENT_DATE);
    }

    public async save(currentDate: CurrentDate): Promise<CurrentDate> {
        return this.getRepo().save(currentDate);
    }
}