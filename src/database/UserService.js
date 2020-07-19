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
var UserService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const DatabaseService_1 = require("./base/DatabaseService");
const inversify_1 = require("inversify");
const types_1 = require("../types");
const StringUtility_1 = require("../utilities/StringUtility");
const DatabaseHelperService_1 = require("./base/DatabaseHelperService");
const Table_1 = require("../documentation/databases/Table");
const DbColumn_1 = require("../models/database/schema/columns/DbColumn");
const Column_1 = require("../documentation/databases/Column");
const DbTable_1 = require("../models/database/schema/DbTable");
let UserService = UserService_1 = class UserService {
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    getUser(discordId, discordName) {
        return __awaiter(this, void 0, void 0, function* () {
            // Sanitize inputs.
            const sanitizedDiscordId = StringUtility_1.StringUtility.escapeMySQLInput(discordId);
            // Construct query.
            let query = `SELECT * FROM ${UserService_1.TABLE_NAME} WHERE discord_id = ${sanitizedDiscordId}`;
            return this.databaseService.query(query).then((res) => {
                if (res.rowCount <= 0) {
                    return this.addUser(discordId, discordName);
                }
                // @ts-ignore
                const result = res.rows[0];
                // Do a small update of the user nickname if different, but don't wait on it.
                if (discordName != result.discord_name) {
                    this.updateUserName(discordId, discordName);
                }
                return result;
            }).catch((err) => {
                console.log("QUERY USED: " + query);
                console.log("ERROR: Could not get guilds. ::: " + err.message);
                console.log(err.stack);
                return null;
            });
        });
    }
    /**
     * Registers a party to a given guild.
     *
     * @param discordId The ID of the user to register.
     * @param discordName The current discord name of the user to register.
     */
    addUser(discordId, discordName) {
        return __awaiter(this, void 0, void 0, function* () {
            // Sanitize inputs.
            const sanitizedDiscordId = StringUtility_1.StringUtility.escapeMySQLInput(discordId);
            const sanitizedDiscordName = StringUtility_1.StringUtility.escapeMySQLInput(discordName);
            // Construct query.
            let query = `INSERT INTO ${UserService_1.TABLE_NAME} (discord_id, discord_name) VALUES (${sanitizedDiscordId}, ${sanitizedDiscordName})`;
            return this.databaseService.query(query).then(() => {
                return this.getUser(discordId, discordName);
            }).catch((err) => {
                console.log("QUERY USED: " + query);
                console.log("ERROR: Could not get guilds. ::: " + err.message);
                console.log(err.stack);
                return null;
            });
        });
    }
    /**
     * Updates the default character and gets the updated user.
     *
     * @param discordId The discord ID of the user.
     * @param discordName The discord name of the user.
     * @param characterId The ID of the character to set as the default.
     */
    updateDefaultCharacter(discordId, discordName, characterId) {
        const setColumns = [new DbColumn_1.DbColumn(Column_1.Column.DEFAULT_CHARACTER_ID, characterId)];
        return this.updateUser(discordId, discordName, setColumns);
    }
    /**
     * Updates the user name for the given user.
     *
     * @param discordId The discord ID of the user.
     * @param discordName The discord name of the user.
     */
    updateUserName(discordId, discordName) {
        const setColumns = [new DbColumn_1.DbColumn(Column_1.Column.DISCORD_NAME, discordName).setSanitized(true)];
        return this.updateUser(discordId, discordName, setColumns);
    }
    /**
     * Update the user with the given information.
     *
     * @param discordId The discord ID of the user.
     * @param discordName The discord name of the user.
     * @param setColumns The things to update.
     */
    updateUser(discordId, discordName, setColumns) {
        // Create query.
        const table = new DbTable_1.DbTable(Table_1.Table.USER)
            .addWhereColumns(new DbColumn_1.DbColumn(Column_1.Column.DISCORD_ID, discordId).setSanitized(true));
        const query = DatabaseHelperService_1.DatabaseHelperService.doUpdateQuery(table);
        // Do the query.
        return this.databaseService.query(query).then(() => {
            return this.getUser(discordId, discordName);
        }).catch((err) => {
            console.log("QUERY USED: " + query);
            console.log("ERROR: Could not update user's name. ::: " + err.message);
            console.log(err.stack);
            return null;
        });
    }
};
UserService.TABLE_NAME = "users";
UserService = UserService_1 = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.DatabaseService)),
    __metadata("design:paramtypes", [DatabaseService_1.DatabaseService])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=UserService.js.map