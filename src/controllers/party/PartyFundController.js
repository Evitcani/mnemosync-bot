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
exports.PartyFundController = void 0;
const inversify_1 = require("inversify");
const Table_1 = require("../../documentation/databases/Table");
const PartyFund_1 = require("../../entity/PartyFund");
const AbstractController_1 = require("../Base/AbstractController");
let PartyFundController = class PartyFundController extends AbstractController_1.AbstractController {
    constructor() {
        super(Table_1.Table.PARTY_FUND);
    }
    /**
     * Creates a new party fund for the given party and type.
     *
     * @param party The party this fund is for.
     * @param type The type of fund this is.
     */
    create(party, type) {
        return __awaiter(this, void 0, void 0, function* () {
            let fund = new PartyFund_1.PartyFund();
            fund.type = type;
            fund.party = party;
            return this.getRepo().save(fund).catch((err) => {
                console.error("ERR ::: Could not create new party fund.");
                console.error(err);
                return null;
            });
        });
    }
    getByPartyAndType(party, type) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getRepo().findOne({ where: { party: party, type: type } });
        });
    }
};
PartyFundController = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [])
], PartyFundController);
exports.PartyFundController = PartyFundController;
//# sourceMappingURL=PartyFundController.js.map