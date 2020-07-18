import {inject, injectable} from "inversify";
import {DatabaseService} from "./base/DatabaseService";
import {TYPES} from "../types";
import {Party} from "../models/database/Party";
import {PartyFund} from "../models/database/PartyFund";
import {StringUtility} from "../utilities/StringUtility";
import {PartyToGuildService} from "./PartyToGuildService";

@injectable()
export class PartyService {
    private static TABLE_NAME = "parties";
    private databaseService: DatabaseService;

    constructor(@inject(TYPES.DatabaseService) databaseService: DatabaseService) {
        this.databaseService = databaseService;
    }

    public async getPartiesInGuild (guildId: string): Promise<Party[]> {
        // Sanitize inputs.
        const sanitizedGuildId = StringUtility.escapeMySQLInput(guildId);

        const query = `SELECT t1.id, t2.name FROM ${PartyToGuildService.TABLE_NAME} t1 INNER JOIN ${PartyService.TABLE_NAME} t2 ON t1.party_id = t2.id WHERE t1.guild_id = ${sanitizedGuildId}`;

        // Construct query.
        return this.databaseService.query(query).then((res) => {
            if (res.rowCount <= 0) {
                return null;
            }

            // @ts-ignore
            const result: Party[] = res.rows;

            return result;
        }).catch((err: Error) => {
            console.log("QUERY USED: " + query);
            console.log("ERROR: Could not get parties for the given guild. ::: " + err.message);
            console.log(err.stack);
            return null;
        });
    }

    async getParty (name: string): Promise<Party>{
        // Sanitize inputs.
        const sanitizedName = StringUtility.escapeMySQLInput(name);

        // Construct query.
        return this.databaseService.query("SELECT * FROM parties WHERE name = " + sanitizedName).then((res) => {
            if (res.rowCount <= 0) {
                return null;
            }

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