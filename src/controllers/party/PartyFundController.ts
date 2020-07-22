import {injectable} from "inversify";
import {Table} from "../../documentation/databases/Table";
import {PartyFund} from "../../entity/PartyFund";
import {Party} from "../../entity/Party";
import {AbstractController} from "../Base/AbstractController";

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
        return this.getRepo().findOne({where: {party: party, type: type}});
    }


}