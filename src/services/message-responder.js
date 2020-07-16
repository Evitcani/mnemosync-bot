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
const MoneyUtility_1 = require("../utilities/MoneyUtility");
let MessageResponder = class MessageResponder {
    constructor(pingFinder, partyService) {
        this.pingFinder = pingFinder;
        this.partyService = partyService;
    }
    /**
     * Figures out which subcommand to send the message to.
     *
     * @param message
     * @param args
     */
    bankCommand(message, args) {
        return __awaiter(this, void 0, void 0, function* () {
            // If there are no args, assume the user just wants a bank statement.
            if (args.length < 1) {
                return this.getBankFunds(message);
            }
            const firstArg = args[0].toLowerCase();
            // Wants a bank statement.
            if (firstArg === "get") {
                return this.getBankFunds(message);
            }
            // Now we send the amount off to be processed.
            return this.updateBankFunds(message, args);
        });
    }
    getBankFunds(message) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.findFunds("BANK").then((fund) => {
                return message.channel.send(MoneyUtility_1.MoneyUtility.formatFundStatement(fund, fund.type));
            });
        });
    }
    /**
     * Updates the amount of money in the shared bank account.
     *
     * @param message The message sent.
     * @param args The other arguments.
     */
    updateBankFunds(message, args) {
        return __awaiter(this, void 0, void 0, function* () {
            // Process the arguments.
            const newFund = MoneyUtility_1.MoneyUtility.processMoneyArguments(args);
            if (newFund === null) {
                return message.channel.send("Command appears to be formatted incorrectly. Please try again!");
            }
            // Find and then update these funds.
            return this.findFunds("BANK").then((fund) => {
                // Pile everything into copper.
                let newAmt = MoneyUtility_1.MoneyUtility.pileIntoCopper(newFund);
                let oldAmt = MoneyUtility_1.MoneyUtility.pileIntoCopper(fund);
                newAmt += oldAmt;
                if (newAmt < 0) {
                    let newAmtInGold = newAmt / 100;
                    return message.channel.send("You don't have enough money to do that! You are short " +
                        newAmtInGold + " gp!");
                }
                const finalFund = MoneyUtility_1.MoneyUtility.copperToFund(newAmt);
                return this.partyService.updateFunds(fund.id, finalFund.platinum, finalFund.gold, finalFund.silver, finalFund.copper).then((updatedFund) => {
                    return message.channel.send(MoneyUtility_1.MoneyUtility.formatFundStatement(updatedFund, updatedFund.type));
                }).catch((err) => {
                    console.log("ERROR: COULD NOT UPDATE FUNDS ::: " + err.message);
                    console.log(err.stack);
                    return null;
                });
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
    findFunds(type) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.partyService.getParty("The Seven Wonders").then((res) => {
                return this.partyService.getFund(res.id, type).catch((err) => {
                    console.log("Failed to find party fund with given information ::: " + err.message);
                    return null;
                });
            }).catch((err) => {
                console.log("Failed to find party with given name ::: " + err.message);
                return null;
            });
        });
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