import {injectable} from "inversify";
import {getManager, Repository} from "typeorm";
import {Table} from "../documentation/databases/Table";
import {PartyFund} from "../entity/PartyFund";
import {Party} from "../entity/Party";

@injectable()
export class PartyFundController {


    public async create(party: Party, type: string): Promise<PartyFund> {
        let fund = new PartyFund();
        fund.type = type;
        fund.party = party;

        return PartyFundController.getRepo().save(fund).then((fund) => {
            return fund;
        }).catch((err: Error) => {
            console.error("ERR ::: Could not create new party fund.");
            console.error(err);
            return null;
        });
    }

    public async getByPartyAndType(party: Party, type: string): Promise<PartyFund> {
        return PartyFundController.getRepo().findOne({where: {party: party, type: type}});
    }

    /**
     * Gets the repo.
     */
    private static getRepo(): Repository<PartyFund> {
        return getManager().getRepository(Table.PARTY_FUND);
    }
}