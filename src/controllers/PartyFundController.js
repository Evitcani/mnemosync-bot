"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
var PartyFundController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartyFundController = void 0;
const inversify_1 = require("inversify");
const typeorm_1 = require("typeorm");
const Table_1 = require("../documentation/databases/Table");
const PartyFund_1 = require("../entity/PartyFund");
let PartyFundController = PartyFundController_1 = class PartyFundController {
    create(party, type) {
        return __awaiter(this, void 0, void 0, function* () {
            let fund = new PartyFund_1.PartyFund();
            fund.type = type;
            fund.party = party;
            return PartyFundController_1.getRepo().save(fund).then((fund) => {
                return fund;
            }).catch((err) => {
                console.error("ERR ::: Could not create new party fund.");
                console.error(err);
                return null;
            });
        });
    }
    getByPartyAndType(party, type) {
        return __awaiter(this, void 0, void 0, function* () {
            return PartyFundController_1.getRepo().findOne({ where: { party: party, type: type } });
        });
    }
    /**
     * Gets the repo.
     */
    static getRepo() {
        return typeorm_1.getManager().getRepository(Table_1.Table.PARTY_FUND);
    }
};
PartyFundController = PartyFundController_1 = __decorate([
    inversify_1.injectable()
], PartyFundController);
exports.PartyFundController = PartyFundController;
//# sourceMappingURL=PartyFundController.js.map