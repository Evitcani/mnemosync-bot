import {DatabaseService} from "./base/DatabaseService";
import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {StringUtility} from "../utilities/StringUtility";

@injectable()
export class UserToGuildService {
    private static TABLE_NAME = "user_to_guild";

    /** Connection to the database object. */
    private databaseService: DatabaseService;

    constructor(@inject(TYPES.DatabaseService) databaseService: DatabaseService) {
        this.databaseService = databaseService;
    }

    public async registerUserOnGuild (guildId: string, discordId: string): Promise<boolean> {
        // Sanitize inputs.
        const sanitizedGuildId = StringUtility.escapeMySQLInput(guildId);
        const sanitizedDiscordId = StringUtility.escapeMySQLInput(discordId);

        // Construct query.
        let query = `SELECT * FROM ${UserToGuildService.TABLE_NAME} WHERE discord_id = ${sanitizedDiscordId} AND guild_id = ${sanitizedGuildId}`;

        // Do the query.
        return this.databaseService.query(query).then((res) => {
            // Exists! We're done here.
            if (res.rowCount > 0) {
                return true;
            }

            // If does not exist, create the row.
            return this.createUserOnGuild(guildId, discordId);
        }).catch((err: Error) => {
            console.log("QUERY USED: " + query);
            console.log("ERROR: Could not check if user already exists in guild. ::: " + err.message);
            console.log(err.stack);
            return false;
        });
    }

    private async createUserOnGuild (guildId: string, discordId: string): Promise<boolean> {
        // Sanitize inputs.
        const sanitizedGuildId = StringUtility.escapeMySQLInput(guildId);
        const sanitizedDiscordId = StringUtility.escapeMySQLInput(discordId);

        // Construct query.
        let query = `INSERT INTO ${UserToGuildService.TABLE_NAME} (discord_id, guild_id) VALUES (${sanitizedDiscordId}, ${sanitizedGuildId})`;

        return this.databaseService.query(query).then(() => {
            return true;
        }).catch((err: Error) => {
            console.log("QUERY USED: " + query);
            console.log("ERROR: Could not register new user for the guild. ::: " + err.message);
            console.log(err.stack);
            return null;
        });
    }
}