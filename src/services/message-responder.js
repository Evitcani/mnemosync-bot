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
exports.MessageResponder = void 0;
const ping_finder_1 = require("./ping-finder");
const inversify_1 = require("inversify");
const types_1 = require("../types");
const PartyService_1 = require("../database/PartyService");
let MessageResponder = class MessageResponder {
    constructor(pingFinder, partyService) {
        this.pingFinder = pingFinder;
        this.partyService = partyService;
    }
    getBankFunds(message) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.partyService.getParty("The Seven Wonders").then((res) => {
                return this.partyService.getFund(res.id, "BANK").then((fund) => {
                    return message.channel.send(this.formatFundStatement(fund, fund.type));
                }).catch((err) => {
                    console.log("Failed to find party fund with given information ::: " + err.message);
                    return null;
                });
            }).catch((err) => {
                console.log("Failed to find party with given name ::: " + err.message);
                return null;
            });
        });
    }
    handle(message) {
        if (this.pingFinder.isPing(message.content)) {
            return this.partyService.getParty("The Seven Wonders").then((res) => {
                return message.channel.send('Pong right back at ya, ' + res.name + "!");
            });
        }
        return Promise.reject();
    }
    formatFundStatement(fund, type) {
        if (type !== null) {
            type = type.toLowerCase();
            type += " ";
        }
        let foundMoney = false;
        let amt = 0;
        if (fund.platinum !== null && fund.platinum > 0) {
            amt += (fund.platinum * 10);
            foundMoney = true;
        }
        if (fund.gold !== null && fund.gold > 0) {
            amt += fund.gold;
            foundMoney = true;
        }
        if (fund.silver !== null && fund.silver > 0) {
            amt += (fund.silver / 10);
            foundMoney = true;
        }
        if (fund.copper !== null && fund.copper > 0) {
            amt += (fund.copper / 100);
            foundMoney = true;
        }
        if (!foundMoney) {
            return "There is no money in this " + type + "fund!";
        }
        return "The following amount is currently in the bank fund: " + amt + " gp";
    }
};
MessageResponder = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.PingFinder)),
    __param(1, inversify_1.inject(types_1.TYPES.PartyService)),
    __metadata("design:paramtypes", [ping_finder_1.PingFinder,
        PartyService_1.PartyService])
], MessageResponder);
exports.MessageResponder = MessageResponder;
//# sourceMappingURL=message-responder.js.map