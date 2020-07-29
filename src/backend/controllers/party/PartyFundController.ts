import {injectable} from "inversify";
import {Table} from "../../../shared/documentation/databases/Table";
import {PartyFund} from "../../../entity/PartyFund";
import {Party} from "../../../entity/Party";
import {AbstractController} from "../Base/AbstractController";
import {DbColumn} from "../../../shared/models/database/schema/columns/DbColumn";
import {Column} from "../../../shared/documentation/databases/Column";
import {DbTable} from "../../../shared/models/database/schema/DbTable";
import {DatabaseHelperService} from "../../database/base/DatabaseHelperService";

@injectable()
export class PartyFundController extends AbstractController<PartyFund> {
    constructor() {
        super(Table.PARTY_FUND);
    }

    /**
     * Creates a new party fund for the given party and type.
     *
     * @param party The party this fund is for.
     * @param type The type of fund this is.
     */
    public async create(party: Party, type: string): Promise<PartyFund> {
        let fund = new PartyFund();
        fund.type = type;
        fund.party = party;

        return this.getRepo().save(fund).catch((err: Error) => {
            console.error("ERR ::: Could not create new party fund.");
            console.error(err);
            return null;
        });
    }

    public async getByPartyAndType(party: Party, type: string): Promise<PartyFund> {
        return this.getRepo().findOne({where: {party: party, type: type}})
            .catch((err: Error) => {
                console.error("ERR ::: Could not find party fund.");
                console.error(err);
                return null;
            });
    }

    public async updateFunds (fund: PartyFund): Promise<PartyFund> {
        return this.getRepo().save(fund).catch((err: Error) => {
            console.error("ERR ::: Could not update party fund.");
            console.error(err);
            return null;
        });
    }
}