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
exports.PartyService = void 0;
const inversify_1 = require("inversify");
const DatabaseService_1 = require("./base/DatabaseService");
const types_1 = require("../types");
const DatabaseHelperService_1 = require("./base/DatabaseHelperService");
const Table_1 = require("../documentation/databases/Table");
const DbColumn_1 = require("../models/database/schema/columns/DbColumn");
const Column_1 = require("../documentation/databases/Column");
const DatabaseDivider_1 = require("../enums/DatabaseDivider");
const DbTable_1 = require("../models/database/schema/DbTable");
/**
 * The party service manager.
 */
let PartyService = class PartyService {
    /**
     * Constructs a new party service.
     *
     * @param databaseService The service to connect to the database.
     */
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    getPartiesInGuild(guildId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get the first table.
            const t1 = new DbTable_1.DbTable(Table_1.Table.PARTY_TO_GUILD).setDesignation(1)
                .addWhereColumns(new DbColumn_1.DbColumn(Column_1.Column.GUILD_ID, guildId).setSanitized(true));
            // Get the second table.
            const t2 = new DbTable_1.DbTable(Table_1.Table.PARTY).setDesignation(2)
                .addSelectColumns(new DbColumn_1.DbColumn(Column_1.Column.ID, null))
                .addSelectColumns(new DbColumn_1.DbColumn(Column_1.Column.NAME, null));
            // Query.
            const query = DatabaseHelperService_1.DatabaseHelperService.do2JoinSelectQuery(t1, t2, new DbColumn_1.DbColumn(Column_1.Column.PARTY_ID, Column_1.Column.ID));
            // Construct query.
            return this.getParties(query);
        });
    }
    getPartiesInGuildWithName(guildId, partyName) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get the first table.
            const t1 = new DbTable_1.DbTable(Table_1.Table.PARTY_TO_GUILD).setDesignation(1)
                .addWhereColumns(new DbColumn_1.DbColumn(Column_1.Column.GUILD_ID, guildId).setSanitized(true));
            // Get the second table.
            const t2 = new DbTable_1.DbTable(Table_1.Table.PARTY).setDesignation(2)
                .addWhereColumns(new DbColumn_1.DbColumn(Column_1.Column.NAME, partyName).setSanitized(true).setDivider(DatabaseDivider_1.DatabaseDivider.LIKE))
                .addSelectColumns(new DbColumn_1.DbColumn(Column_1.Column.ID, null))
                .addSelectColumns(new DbColumn_1.DbColumn(Column_1.Column.NAME, null));
            // Query.
            const query = DatabaseHelperService_1.DatabaseHelperService.do2JoinSelectQuery(t1, t2, new DbColumn_1.DbColumn(Column_1.Column.PARTY_ID, Column_1.Column.ID));
            // Do the query.
            return this.getParties(query);
        });
    }
    /**
     * Gets the parties with the given query.
     * @param query
     */
    getParties(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.databaseService.query(query).then((res) => {
                console.debug("QUERY USED: " + query);
                if (res.rowCount <= 0) {
                    return null;
                }
                // @ts-ignore
                const result = res.rows;
                return result;
            }).catch((err) => {
                console.error("QUERY USED: " + query);
                console.error("ERROR: Could not get parties for the given guild. ::: " + err.message);
                console.error(err.stack);
                return null;
            });
        });
    }
    /**
     * Gets the party with the given name.
     *
     * @param name
     */
    getParty(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const table = new DbTable_1.DbTable(Table_1.Table.PARTY)
                .addWhereColumns(new DbColumn_1.DbColumn(Column_1.Column.NAME, name).setSanitized(true).setDivider(DatabaseDivider_1.DatabaseDivider.LIKE));
            const query = DatabaseHelperService_1.DatabaseHelperService.doSelectQuery(table);
            // Construct query.
            return this.databaseService.query(query).then((res) => {
                if (res.rowCount <= 0) {
                    return null;
                }
                // @ts-ignore
                const result = res.rows[0];
                return result;
            }).catch((err) => {
                console.log("ERROR: COULD NOT GET PARTY ::: " + err.message);
                console.log(err.stack);
                return null;
            });
        });
    }
};
PartyService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.DatabaseService)),
    __metadata("design:paramtypes", [DatabaseService_1.DatabaseService])
], PartyService);
exports.PartyService = PartyService;
//# sourceMappingURL=PartyService.js.map