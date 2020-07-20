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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharacterService = void 0;
const inversify_1 = require("inversify");
const DatabaseService_1 = require("./base/DatabaseService");
const types_1 = require("../types");
const Character_1 = require("../entity/Character");
const DatabaseHelperService_1 = require("./base/DatabaseHelperService");
const Table_1 = require("../documentation/databases/Table");
const DbColumn_1 = require("../models/database/schema/columns/DbColumn");
const Column_1 = require("../documentation/databases/Column");
const DbTable_1 = require("../models/database/schema/DbTable");
const UserToCharacterService_1 = require("./UserToCharacterService");
const UserService_1 = require("./UserService");
const DatabaseDivider_1 = require("../enums/DatabaseDivider");
const typeorm_1 = require("typeorm");
const Nickname_1 = require("../entity/Nickname");
let CharacterService = class CharacterService {
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
            return typeorm_1.getManager().findOne(Character_1.Character, { where: { id: id } }).then((character) => {
                return character;
            }).catch((err) => {
                console.log(`ERROR: Could not get character (ID: ${id}). ::: ${err.message}`);
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
                // No results.
                if (res.rowCount <= 0) {
                    return null;
                }
                // @ts-ignore Get the character from the results.
                const id = res.rows[0].id;
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
            // Create nickname for the mapping.
            const nickname = new Nickname_1.Nickname();
            nickname.discord_id = discordId;
            nickname.character = character;
            nickname.name = character.name;
            // Add the nickname to the character.
            character.nicknames = [];
            character.nicknames.push(nickname);
            return typeorm_1.getManager().getRepository(Character_1.Character).save(character).then((char) => {
                // Now, we have to add the character to the mapping database.
                return this.userToCharacterService.createNewMap(char.id, discordId, char.name).then((res) => {
                    if (!res) {
                        // Something went wrong.
                        return null;
                    }
                    return this.userService.getUser(discordId, discordName).then((user) => {
                        user.defaultCharacter = char;
                        return this.userService.updateUser(user).then(() => {
                            return char;
                        });
                    });
                });
            }).catch((err) => {
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
                return user;
            });
        });
    }
};
CharacterService = __decorate([
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