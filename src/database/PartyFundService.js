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
exports.PartyFundService = void 0;
const DatabaseService_1 = require("./base/DatabaseService");
const inversify_1 = require("inversify");
const types_1 = require("../types");
const DatabaseHelperService_1 = require("./base/DatabaseHelperService");
const Table_1 = require("../documentation/databases/Table");
const Column_1 = require("../documentation/databases/Column");
const DbColumn_1 = require("../models/database/schema/columns/DbColumn");
/**
 * Service for managing calls to the database related to party funds.
 */
let PartyFundService = class PartyFundService {
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    updateFunds(id, platinum, gold, silver, copper) {
        return __awaiter(this, void 0, void 0, function* () {
            const setColumns = [];
            // Check all the gold amounts, only update what changed.
            if (platinum !== null) {
                setColumns.push(new DbColumn_1.DbColumn(Column_1.Column.PLATINUM, platinum));
            }
            if (gold !== null) {
                setColumns.push(new DbColumn_1.DbColumn(Column_1.Column.GOLD, gold));
            }
            if (silver !== null) {
                setColumns.push(new DbColumn_1.DbColumn(Column_1.Column.SILVER, silver));
            }
            if (copper !== null) {
                setColumns.push(new DbColumn_1.DbColumn(Column_1.Column.COPPER, copper));
            }
            const query = DatabaseHelperService_1.DatabaseHelperService.doUpdateQuery(Table_1.Table.PARTY_FUND, setColumns, [new DbColumn_1.DbColumn(Column_1.Column.ID, id)]);
            console.log("Updating party funds with query: " + query);
            return this.databaseService.query(query).then(() => {
                return this.getFundById(id);
            }).catch((err) => {
                console.log("ERROR: Could not update the party funds! ::: " + err.message);
                console.log(err.stack);
                return null;
            });
        });
    }
    getFundById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = DatabaseHelperService_1.DatabaseHelperService.doSelectQuery(Table_1.Table.PARTY_FUND, [new DbColumn_1.DbColumn(Column_1.Column.ID, id)]);
            return this.doGetFund(query);
        });
    }
    getFund(partyID, type) {
        return __awaiter(this, void 0, void 0, function* () {
            // columns
            const columns = [new DbColumn_1.DbColumn(Column_1.Column.TYPE, type).setSanitized(true), new DbColumn_1.DbColumn(Column_1.Column.PARTY_ID, partyID)];
            // Construct query.
            const query = DatabaseHelperService_1.DatabaseHelperService.doSelectQuery(Table_1.Table.PARTY_FUND, columns);
            return this.doGetFund(query);
        });
    }
    doGetFund(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.databaseService.query(query).then((res) => {
                if (res.rowCount <= 0) {
                    return null;
                }
                // @ts-ignore
                const result = res.rows[0];
                return result;
            }).catch((err) => {
                console.log("ERROR: Could not get party funds! ::: " + err.message + " ::: QUERY: " + query);
                console.log(err.stack);
                return null;
            });
        });
    }
};
PartyFundService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.DatabaseService)),
    __metadata("design:paramtypes", [DatabaseService_1.DatabaseService])
], PartyFundService);
exports.PartyFundService = PartyFundService;
//# sourceMappingURL=PartyFundService.js.map