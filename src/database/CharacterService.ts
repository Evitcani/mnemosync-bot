import {inject, injectable} from "inversify";
import {DatabaseService} from "./base/DatabaseService";
import {TYPES} from "../types";
import {Character} from "../models/database/Character";
import {DatabaseHelperService} from "./base/DatabaseHelperService";
import {Table} from "../documentation/databases/Table";
import {DbColumn} from "../models/database/schema/columns/DbColumn";
import {Column} from "../documentation/databases/Column";
import {TravelConfig} from "../models/database/TravelConfig";
import {DbTable} from "../models/database/schema/DbTable";
import {UserToCharacterService} from "./UserToCharacterService";
import {UserService} from "./UserService";
import {JSONField} from "../documentation/databases/JSONField";
import {User} from "../models/database/User";
import {DatabaseDivider} from "../enums/DatabaseDivider";

@injectable()
export class CharacterService {
    /** Connection to the database object. */
    private databaseService: DatabaseService;
    /** Connection to the user table. */
    private userService: UserService;
    /** Connection to the character to user table. */
    private userToCharacterService: UserToCharacterService;

    constructor(@inject(TYPES.DatabaseService) databaseService: DatabaseService,
                @inject(TYPES.UserService) userService: UserService,
                @inject(TYPES.UserToCharacterService) userToCharacterService: UserToCharacterService) {
        this.databaseService = databaseService;
        this.userService = userService;
        this.userToCharacterService = userToCharacterService;
    }

    /**
     * Gets the character with the given ID from the database.
     *
     * @param id The ID of the character to get.
     */
    public async getCharacter(id: number): Promise<Character> {
        // Not a valid argument.
        if (id == null || id < 1) {
            return null;
        }

        // Create the column.
        const table = new DbTable(Table.CHARACTER)
            .addWhereColumns(new DbColumn(Column.ID, id));
        const query = DatabaseHelperService.doSelectQuery(table);

        // Go out and do the query.
        return this.databaseService.query(query).then((res) => {
            // No results.
            if (res.rowCount <= 0) {
                return null;
            }

            // @ts-ignore Get the character from the results.
            const result: Character = res.rows[0];
            return result;
        }).catch((err: Error) => {
            console.log("QUERY USED: " + query);
            console.log("ERROR: Could not get guilds. ::: " + err.message);
            console.log(err.stack);
            return null;
        });
    }

    public async getCharacterByName(discordId: string, characterName: string): Promise<Character> {
        // Create the column.
        const t1 = new DbTable(Table.CHARACTER).setDesignation(1)
            .addSelectColumns(new DbColumn(Column.ID, null));
        const t2 = new DbTable(Table.USER_TO_CHARACTER).setDesignation(2)
            .addWhereColumns(new DbColumn(Column.DISCORD_ID, discordId).setSanitized(true))
            .addWhereColumns(new DbColumn(Column.NAME, characterName).setSanitized(true).setDivider(DatabaseDivider.LIKE));
        const query = DatabaseHelperService.do2JoinSelectQuery(t1, t2, new DbColumn(Column.ID, Column.CHARACTER_ID));

        // Go out and do the query.
        return this.databaseService.query(query).then((res) => {
            // No results.
            if (res.rowCount <= 0) {
                return null;
            }

            // @ts-ignore Get the character from the results.
            const id: number = res.rows[0];
            console.debug("Got ID of a character by name: " + id);
            return this.getCharacter(id).then((character) => {
                return character;
            });
        }).catch((err: Error) => {
            console.log("QUERY USED: " + query);
            console.log("ERROR: Could not get guilds. ::: " + err.message);
            console.log(err.stack);
            return null;
        });
    }

    /**
     *
     * @param character The character
     * @param discordId
     * @param discordName
     */
    public async createCharacter(character: Character, discordId: string, discordName: string): Promise<Character> {
        const setColumn: DbColumn[] = [];

        // Push on the name
        setColumn.push(new DbColumn(Column.NAME, character.name).setSanitized(true));

        // Push on the party id.
        if (character.party_id != null) {
            setColumn.push(new DbColumn(Column.PARTY_ID, character.party_id).setSanitized(true));
        }

        if (character.travel_config != null) {
            setColumn.push(new DbColumn(Column.TRAVEL_CONFIG,
                CharacterService.convertTravelConfig(character.travel_config)));
        }

        const table = new DbTable(Table.CHARACTER).setInsertColumns(setColumn);
        const query = DatabaseHelperService.doInsertQuery(table);

        // Go out and do the query.
        return this.databaseService.query(query).then(() => {
            return this.getCharacterByName(discordId, character.name).then((character) => {
                // Now, we have to add the character to the mapping database.
                return this.userToCharacterService.createNewMap(character.id, discordId, character.name).then((res) => {
                    if (!res) {
                        // Something went wrong.
                        return null;
                    }

                    // Now switch the default character.
                    return this.userService.updateDefaultCharacter(discordId, discordName, character.id).then((res) => {
                        if (res == null) {
                            return null;
                        }

                        return character;
                    });
                });
            });
        }).catch((err: Error) => {
            console.log("QUERY USED: " + query);
            console.log("ERROR: Could not create the character. ::: " + err.message);
            console.log(err.stack);
            return null;
        });
    }

    /**
     * Gets the given user and their default character.
     *
     * @param discordId Discord ID of the user.
     * @param discordName
     */
    public async getUserWithCharacter(discordId: string, discordName: string): Promise<User> {
        return this.userService.getUser(discordId, discordName).then((user) => {
            if (user.character_id == null) {
                return user;
            }

            return this.getCharacter(user.character_id).then((character) => {
                user.character = character;
                return user;
            });
        });
    }

    private static convertTravelConfig(travelConfig: TravelConfig): any {
        const json = {};

        json[JSONField.CAN_DRINK_WATER] = travelConfig.can_drink_water;
        json[JSONField.CAN_EAT] = travelConfig.can_eat;

        return json;
    }
}