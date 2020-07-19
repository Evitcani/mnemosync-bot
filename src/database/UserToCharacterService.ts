import {DatabaseService} from "./base/DatabaseService";
import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {DbTable} from "../models/database/schema/DbTable";
import {Table} from "../documentation/databases/Table";
import {DatabaseHelperService} from "./base/DatabaseHelperService";
import {DbColumn} from "../models/database/schema/columns/DbColumn";
import {Column} from "../documentation/databases/Column";

@injectable()
export class UserToCharacterService {
    /** Connection to the database object. */
    private databaseService: DatabaseService;

    constructor(@inject(TYPES.DatabaseService) databaseService: DatabaseService) {
        this.databaseService = databaseService;
    }

    /**
     * Maps a character id to a discord id.
     *
     * @param characterId
     * @param discordId
     * @param name
     */
    public async createNewMap(characterId: number, discordId: string, name: string): Promise<boolean> {
        const table = new DbTable(Table.USER_TO_CHARACTER)
            .addInsertColumns(new DbColumn(Column.DISCORD_ID, discordId).setSanitized(true))
            .addInsertColumns(new DbColumn(Column.CHARACTER_ID, characterId))
            .addInsertColumns(new DbColumn(Column.NAME, name).setSanitized(true));
        const query = DatabaseHelperService.doInsertQuery(table);

        // Do the query.
        return this.databaseService.query(query).then(() => {
            // Created so just return true.
            return true;
        }).catch((err: Error) => {
            console.log("QUERY USED: " + query);
            console.log("ERROR: Could not map character to user. ::: " + err.message);
            console.log(err.stack);
            return false;
        });
    }
}