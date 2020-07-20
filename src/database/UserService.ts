import {DatabaseService} from "./base/DatabaseService";
import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {StringUtility} from "../utilities/StringUtility";
import {User} from "../models/database/User";
import {DatabaseHelperService} from "./base/DatabaseHelperService";
import {Table} from "../documentation/databases/Table";
import {DbColumn} from "../models/database/schema/columns/DbColumn";
import {Column} from "../documentation/databases/Column";
import {DbTable} from "../models/database/schema/DbTable";

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

            // Do a small update of the user nickname if different, but don't wait on it.
            if (discordName != result.discord_name) {
                this.updateUserName(discordId, discordName);
            }

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
        const sanitizedDiscordId = StringUtility.escapeMySQLInput(discordId);
        const sanitizedDiscordName = StringUtility.escapeMySQLInput(discordName);

        // Construct query.
        let query = `INSERT INTO ${UserService.TABLE_NAME} (discord_id, discord_name) VALUES (${sanitizedDiscordId}, ${sanitizedDiscordName})`;

        return this.databaseService.query(query).then(() => {
            return this.getUser(discordId, discordName);
        }).catch((err: Error) => {
            console.log("QUERY USED: " + query);
            console.log("ERROR: Could not get guilds. ::: " + err.message);
            console.log(err.stack);
            return null;
        });
    }

    /**
     * Updates the default character and gets the updated user.
     *
     * @param discordId The discord ID of the user.
     * @param discordName The discord name of the user.
     * @param characterId The ID of the character to set as the default.
     */
    public updateDefaultCharacter(discordId: string, discordName: string, characterId: number): Promise<User> {
        const setColumns: DbColumn[] = [new DbColumn(Column.DEFAULT_CHARACTER_ID, characterId)];
        return this.updateUser(discordId, discordName, setColumns);
    }

    /**
     * Updates the user name for the given user.
     *
     * @param discordId The discord ID of the user.
     * @param discordName The discord name of the user.
     */
    private updateUserName(discordId: string, discordName: string): Promise<User> {
        const setColumns: DbColumn[] = [new DbColumn(Column.DISCORD_NAME, discordName).setSanitized(true)];
        return this.updateUser(discordId, discordName, setColumns);
    }

    /**
     * Update the user with the given information.
     *
     * @param discordId The discord ID of the user.
     * @param discordName The discord name of the user.
     * @param setColumns The things to update.
     */
    private updateUser(discordId: string, discordName: string, setColumns: DbColumn[]): Promise<User> {
        // Create query.
        const table = new DbTable(Table.USER)
            .setSetColumns(setColumns)
            .addWhereColumns(new DbColumn(Column.DISCORD_ID, discordId).setSanitized(true));
        const query = DatabaseHelperService.doUpdateQuery(table);

        // Do the query.
        return this.databaseService.query(query).then(() => {
            return this.getUser(discordId, discordName);
        }).catch((err: Error) => {
            console.log("QUERY USED: " + query);
            console.log("ERROR: Could not update user. ::: " + err.message);
            console.log(err.stack);
            return null;
        });
    }
}