import {injectable} from "inversify";
import {AbstractController} from "../Base/AbstractController";
import {Sending} from "../../entity/Sending";
import {Table} from "../../documentation/databases/Table";

@injectable()
export class SendingController extends AbstractController<Sending> {
    constructor() {
        super(Table.SENDING);
    }

    /**
     * Creates a new sending.
     *
     * @param sending
     */
    create(sending: Sending): Promise<Sending> {
        return this.getRepo().save(sending);
    }
}