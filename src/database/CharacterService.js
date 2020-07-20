"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var CharacterService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharacterService = void 0;
const inversify_1 = require("inversify");
const DatabaseService_1 = require("./base/DatabaseService");
const types_1 = require("../types");
const DatabaseHelperService_1 = require("./base/DatabaseHelperService");
const Table_1 = require("../documentation/databases/Table");
const DbColumn_1 = require("../models/database/schema/columns/DbColumn");
const Column_1 = require("../documentation/databases/Column");
const DbTable_1 = require("../models/database/schema/DbTable");
const UserToCharacterService_1 = require("./UserToCharacterService");
const UserService_1 = require("./UserService");
const JSONField_1 = require("../documentation/databases/JSONField");
const DatabaseDivider_1 = require("../enums/DatabaseDivider");
let CharacterService = CharacterService_1 = class CharacterService {
    constructor(databaseService, userService, userToCharacterService) {
        this.databaseService = databaseService;
        this.userService = userService;
        this.userToCharacterService = userToCharacterService;
    }
    /**
     * Gets the character with the given ID from the database.
     *
     * @param id The ID of the character to get.
     */
    getCharacter(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Not a valid argument.
            if (id == null || id < 1) {
                return null;
            }
            // Create the column.
            const table = new DbTable_1.DbTable(Table_1.Table.CHARACTER)
                .addWhereColumns(new DbColumn_1.DbColumn(Column_1.Column.ID, id));
            const query = DatabaseHelperService_1.DatabaseHelperService.doSelectQuery(table);
            // Go out and do the query.
            return this.databaseService.query(query).then((res) => {
                // No results.
                if (res.rowCount <= 0) {
                    return null;
                }
                // @ts-ignore Get the character from the results.
                const result = res.rows[0];
                return result;
            }).catch((err) => {
                console.log("QUERY USED: " + query);
                console.log("ERROR: Could not get guilds. ::: " + err.message);
                console.log(err.stack);
                return null;
            });
        });
    }
    getCharacterByName(discordId, characterName) {
        return __awaiter(this, void 0, void 0, function* () {
            // Create the column.
            const t1 = new DbTable_1.DbTable(Table_1.Table.CHARACTER).setDesignation(1)
                .addSelectColumns(new DbColumn_1.DbColumn(Column_1.Column.ID, null));
            const t2 = new DbTable_1.DbTable(Table_1.Table.USER_TO_CHARACTER).setDesignation(2)
                .addWhereColumns(new DbColumn_1.DbColumn(Column_1.Column.DISCORD_ID, discordId).setSanitized(true))
                .addWhereColumns(new DbColumn_1.DbColumn(Column_1.Column.NAME, characterName).setSanitized(true).setDivider(DatabaseDivider_1.DatabaseDivider.LIKE));
            const query = DatabaseHelperService_1.DatabaseHelperService.do2JoinSelectQuery(t1, t2, new DbColumn_1.DbColumn(Column_1.Column.ID, Column_1.Column.CHARACTER_ID));
            // Go out and do the query.
            return this.databaseService.query(query).then((res) => {
                console.log("QUERY USED: " + query);
                console.log(res);
                // No results.
                if (res.rowCount <= 0) {
                    return null;
                }
                // @ts-ignore Get the character from the results.
                const id = res.rows[0].id;
                console.debug("Got ID of a character by name: " + id);
                return this.getCharacter(id);
            }).catch((err) => {
                console.log("QUERY USED: " + query);
                console.log("ERROR: Could not get guilds. ::: " + err.message);
                console.log(err.stack);
                return null;
            });
        });
    }
    /**
     *
     * @param character The character
     * @param discordId
     * @param discordName
     */
    createCharacter(character, discordId, discordName) {
        return __awaiter(this, void 0, void 0, function* () {
            const setColumn = [];
            // Push on the name
            setColumn.push(new DbColumn_1.DbColumn(Column_1.Column.NAME, character.name).setSanitized(true));
            // Push on the party id.
            if (character.party_id != null) {
                setColumn.push(new DbColumn_1.DbColumn(Column_1.Column.PARTY_ID, character.party_id).setSanitized(true));
            }
            if (character.travel_config != null) {
                setColumn.push(new DbColumn_1.DbColumn(Column_1.Column.TRAVEL_CONFIG, CharacterService_1.convertTravelConfig(character.travel_config)));
            }
            const table = new DbTable_1.DbTable(Table_1.Table.CHARACTER).setInsertColumns(setColumn);
            const query = DatabaseHelperService_1.DatabaseHelperService.doInsertQuery(table);
            // Go out and do the query.
            return this.databaseService.query(query).then((res) => {
                console.log("Result from insert: " + res);
                // @ts-ignore Get the character from the results.
                const char = res.rows[0];
                // Now, we have to add the character to the mapping database.
                return this.userToCharacterService.createNewMap(char.id, discordId, char.name).then((res) => {
                    if (!res) {
                        // Something went wrong.
                        return null;
                    }
                    // Now switch the default character.
                    return this.userService.updateDefaultCharacter(discordId, discordName, char.id).then((res) => {
                        if (res == null) {
                            return null;
                        }
                        return char;
                    });
                });
            }).catch((err) => {
                console.log("QUERY USED: " + query);
                console.log("ERROR: Could not create the character. ::: " + err.message);
                console.log(err.stack);
                return null;
            });
        });
    }
    /**
     * Gets the given user and their default character.
     *
     * @param discordId Discord ID of the user.
     * @param discordName
     */
    getUserWithCharacter(discordId, discordName) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.userService.getUser(discordId, discordName).then((user) => {
                if (user.character_id == null) {
                    return user;
                }
                return this.getCharacter(user.character_id).then((character) => {
                    user.character = character;
                    return user;
                });
            });
        });
    }
    static convertTravelConfig(travelConfig) {
        const json = {};
        json[JSONField_1.JSONField.CAN_DRINK_WATER] = travelConfig.can_drink_water;
        json[JSONField_1.JSONField.CAN_EAT] = travelConfig.can_eat;
        return json;
    }
};
CharacterService = CharacterService_1 = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.DatabaseService)),
    __param(1, inversify_1.inject(types_1.TYPES.UserService)),
    __param(2, inversify_1.inject(types_1.TYPES.UserToCharacterService)),
    __metadata("design:paramtypes", [DatabaseService_1.DatabaseService,
        UserService_1.UserService,
        UserToCharacterService_1.UserToCharacterService])
], CharacterService);
exports.CharacterService = CharacterService;
//# sourceMappingURL=CharacterService.js.map