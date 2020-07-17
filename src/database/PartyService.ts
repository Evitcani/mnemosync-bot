import {inject, injectable} from "inversify";
import {DatabaseService} from "./DatabaseService";
import {TYPES} from "../types";
import {Party} from "../models/database/Party";
import {PartyFund} from "../models/database/PartyFund";
import {StringUtility} from "../utilities/StringUtility";

@injectable()
export class PartyService {
    private databaseService: DatabaseService;

    constructor(@inject(TYPES.DatabaseService) databaseService: DatabaseService) {
        this.databaseService = databaseService;
    }



    async getParty (name: string): Promise<Party>{
        // Sanitize inputs.
        name = StringUtility.escapeMySQLInput(name);

        // Construct query.
        return this.databaseService.query("SELECT * FROM parties WHERE name = " + name).then((res) => {
                // @ts-ignore
                const result: Party = res.rows[0];

                return result;
            }).catch((err: Error) => {
                console.log("ERROR: COULD NOT GET PARTY ::: " + err.message);
                console.log(err.stack);
                return null;
            });
    }
}