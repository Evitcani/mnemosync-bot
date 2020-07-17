import {DatabaseService} from "./DatabaseService";
import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {StringUtility} from "../utilities/StringUtility";

@injectable()
export class UserDefaultPartyService {
    private static TABLE_NAME = "user_default_parties";

    /** Connection to the database object. */
    private databaseService: DatabaseService;

    constructor(@inject(TYPES.DatabaseService) databaseService: DatabaseService) {
        this.databaseService = databaseService;
    }

    /**
     * Gets all the parties related to the given guild.
     *
     * @param guildId The ID of the guild to get all the parties for.
     * @param discordId The ID of the user.
     */
    public async getDefaultParty(guildId: string, discordId: string): Promise<number> {
        // Sanitize inputs.
        const sanitizedGuildId = StringUtility.escapeMySQLInput(guildId);
        const sanitizedDiscordId = StringUtility.escapeMySQLInput(discordId);

        console.debug(`Searching for guild (ID: ${guildId}) for user (ID: ${discordId})...`);

        // Construct query.
        let query = `SELECT party_id FROM ${UserDefaultPartyService.TABLE_NAME} WHERE guild_id = ${sanitizedGuildId} AND discord_id = ${sanitizedDiscordId}`;

        return this.databaseService.query(query).then((res) => {
            if (res.rowCount <= 0) {
                return null;
            }

            // @ts-ignore
            const result: number = res.rows[0];

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
     * @param discordId The ID of the user.
     */
    private async addDefaultParty(partyId: number, guildId: string, discordId: string): Promise<number> {
        // Sanitize inputs.
        const sanitizedGuildId = StringUtility.escapeMySQLInput(guildId);
        const sanitizedDiscordId = StringUtility.escapeMySQLInput(discordId);

        // Construct query.
        let query = `INSERT INTO ${UserDefaultPartyService.TABLE_NAME} (party_id, guild_id, discord_id) VALUES (${partyId}, ${sanitizedGuildId}, ${sanitizedDiscordId})`;

        return this.databaseService.query(query).then(() => {
            return this.getDefaultParty(guildId, discordId);
        }).catch((err: Error) => {
            console.log("QUERY USED: " + query);
            console.log("ERROR: Could not get guilds. ::: " + err.message);
            console.log(err.stack);
            return null;
        });
    }
}