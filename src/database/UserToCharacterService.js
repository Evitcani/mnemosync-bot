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
exports.UserToCharacterService = void 0;
const DatabaseService_1 = require("./base/DatabaseService");
const inversify_1 = require("inversify");
const types_1 = require("../types");
const DbTable_1 = require("../models/database/schema/DbTable");
const Table_1 = require("../documentation/databases/Table");
const DatabaseHelperService_1 = require("./base/DatabaseHelperService");
const DbColumn_1 = require("../models/database/schema/columns/DbColumn");
const Column_1 = require("../documentation/databases/Column");
let UserToCharacterService = class UserToCharacterService {
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    /**
     * Maps a character id to a discord id.
     *
     * @param characterId
     * @param discordId
     */
    createNewMap(characterId, discordId) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = new DbTable_1.DbTable(Table_1.Table.USER_TO_CHARACTER)
                .addInsertColumns(new DbColumn_1.DbColumn(Column_1.Column.DISCORD_ID, discordId).setSanitized(true))
                .addInsertColumns(new DbColumn_1.DbColumn(Column_1.Column.CHARACTER_ID, characterId));
            const query = DatabaseHelperService_1.DatabaseHelperService.doInsertQuery(table);
            // Do the query.
            return this.databaseService.query(query).then(() => {
                // Created so just return true.
                return true;
            }).catch((err) => {
                console.log("QUERY USED: " + query);
                console.log("ERROR: Could not map character to user. ::: " + err.message);
                console.log(err.stack);
                return false;
            });
        });
    }
};
UserToCharacterService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.DatabaseService)),
    __metadata("design:paramtypes", [DatabaseService_1.DatabaseService])
], UserToCharacterService);
exports.UserToCharacterService = UserToCharacterService;
//# sourceMappingURL=UserToCharacterService.js.map