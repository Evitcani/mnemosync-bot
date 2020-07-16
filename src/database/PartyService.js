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
const DatabaseService_1 = require("./DatabaseService");
const types_1 = require("../types");
let PartyService = class PartyService {
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    updateFunds(id, platinum, gold, silver, copper) {
        return __awaiter(this, void 0, void 0, function* () {
            let query = "UPDATE party_funds SET ";
            let prev = false;
            // Check all the gold amounts, only update what changed.
            if (platinum !== null) {
                query += "platinum = " + platinum;
                prev = true;
            }
            if (gold !== null) {
                if (prev) {
                    query += ", ";
                }
                query += "gold = " + gold;
                prev = true;
            }
            if (silver !== null) {
                if (prev) {
                    query += ", ";
                }
                query += "silver = " + silver;
                prev = true;
            }
            if (copper !== null) {
                if (prev) {
                    query += ", ";
                }
                query += "copper = " + copper;
            }
            query += " WHERE id = " + id;
            return this.databaseService.query(query).then((res) => {
                console.log(JSON.stringify(res));
                return res;
            }).catch((err) => {
                console.log("ERROR: COULD NOT GET PARTY ::: " + err.message);
                return null;
            });
        });
    }
    getFund(partyID, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = "SELECT * FROM party_funds WHERE type = '" + type + "' AND party_id = " + partyID;
            return this.databaseService.query(query).then((res) => {
                console.log(JSON.stringify(res));
                // @ts-ignore
                const result = res.rows[0];
                return result;
            }).catch((err) => {
                console.log("ERROR: COULD NOT GET PARTY ::: " + err.message);
                return null;
            });
        });
    }
    getParty(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.databaseService.query("SELECT * FROM parties").then((res) => {
                console.log(JSON.stringify(res));
                // @ts-ignore
                const result = res.rows[0];
                return result;
            }).catch((err) => {
                console.log("ERROR: COULD NOT GET PARTY ::: " + err.message);
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