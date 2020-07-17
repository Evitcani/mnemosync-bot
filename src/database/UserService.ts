import {DatabaseService} from "./DatabaseService";
import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {StringUtility} from "../utilities/StringUtility";
import {User} from "../models/database/User";
import {Party} from "../models/database/Party";

@injectable()
export class UserService {
    private static TABLE_NAME = "users";
    /** Connection to the database object. */
    private databaseService: DatabaseService;

    constructor(@inject(TYPES.DatabaseService) databaseService: DatabaseService) {
        this.databaseService = databaseService;
    }

    public async getUser(discordId: string, discordName: string): Promise<User> {
        // Sanitize inputs.
        const sanitizedDiscordId = StringUtility.escapeMySQLInput(discordId);

        // Construct query.
        let query = `SELECT * FROM ${UserService.TABLE_NAME} WHERE discord_id = ${sanitizedDiscordId}`;

        return this.databaseService.query(query).then((res) => {
            if (res.rowCount <= 0) {
                return this.addUser(discordId, discordName);
            }

            // @ts-ignore
            const result: User = res.rows[0];

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
     * @param discordId The ID of the user to register.
     * @param discordName The current discord name of the user to register.
     */
    private async addUser(discordId: string, discordName: string): Promise<User> {
        // Sanitize inputs.
        discordId = StringUtility.escapeMySQLInput(discordId);
        discordName = StringUtility.escapeMySQLInput(discordName);

        // Construct query.
        let query = `INSERT INTO ${UserService.TABLE_NAME} (discord_id, discord_name) VALUES (${discordId}, ${discordName})`;

        return this.databaseService.query(query).then(() => {
            return this.getUser(discordId, discordName);
        }).catch((err: Error) => {
            console.log("QUERY USED: " + query);
            console.log("ERROR: Could not get guilds. ::: " + err.message);
            console.log(err.stack);
            return null;
        });
    }
}