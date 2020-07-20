import {getManager, Repository} from "typeorm";
import {Table} from "../documentation/databases/Table";
import {Party} from "../entity/Party";

export class PartyController {
    constructor() {

    }

    public create(partyName: string, guildId: string) {

    }

    private static getRepo(): Repository<Party> {
        return getManager().getRepository(Table.PARTY);
    }
}