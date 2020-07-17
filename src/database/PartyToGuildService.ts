import {DatabaseService} from "./DatabaseService";
import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {StringUtility} from "../utilities/StringUtility";


@injectable()
export class PartyToGuildService {
    public static TABLE_NAME = "party_to_guild";
    /** Connection to the database object. */
    private databaseService: DatabaseService;

    constructor(@inject(TYPES.DatabaseService) databaseService: DatabaseService) {
        this.databaseService = databaseService;
    }

    /**
     * Gets all the parties related to the given guild.
     *
     * @param guildId The ID of the guild to get all the parties for.
     */
    public async getParties(guildId: string): Promise<number[]> {
        // Sanitize inputs.
        const sanitizedGuildId = StringUtility.escapeMySQLInput(guildId);

        // Construct query.
        let query = "SELECT party_id FROM " + PartyToGuildService.TABLE_NAME + " WHERE guild_id = " + sanitizedGuildId;

        return this.databaseService.query(query).then((res) => {
            if (res.rowCount <= 0) {
                return null;
            }

            // @ts-ignore
            const result: number[] = res.rows;

            return result;
        }).catch((err: Error) => {
            console.log("QUERY USED: " + query);
            console.log("ERROR: Could not get guilds. ::: " + err.message);
            console.log(err.stack);
            return null;
        });
    }

    /**
     * Registers a party to a given guild.
     *
     * @param partyId The ID of the party to register.
     * @param guildId The ID of the guild to register the party to.
     */
    public async addParty(partyId: number, guildId: string): Promise<number[]> {
        // Sanitize inputs.
        const sanitizedGuildId = StringUtility.escapeMySQLInput(guildId);

        // Construct query.
        let query = `INSERT INTO ${PartyToGuildService.TABLE_NAME} (party_id, guild_id) VALUES (${partyId}, ${sanitizedGuildId})`;

        return this.databaseService.query(query).then(() => {
            return this.getParties(guildId);
        }).catch((err: Error) => {
            console.log("QUERY USED: " + query);
            console.log("ERROR: Could not get guilds. ::: " + err.message);
            console.log(err.stack);
            return null;
        });
    }
}