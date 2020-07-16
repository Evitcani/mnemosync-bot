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
var MessageResponder_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageResponder = void 0;
const ping_finder_1 = require("./ping-finder");
const inversify_1 = require("inversify");
const types_1 = require("../types");
const PartyService_1 = require("../database/PartyService");
let MessageResponder = MessageResponder_1 = class MessageResponder {
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
                return message.channel.send(this.formatFundStatement(fund, fund.type));
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
            return this.findFunds("BANK").then((fund) => {
                return message.channel.send(this.formatFundStatement(fund, fund.type));
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
    processMoneyArguments(args) {
        let fund = { id: null, party_id: null, type: null, platinum: null, gold: null, silver: null, copper: null };
        let amt = -1;
        let negative = false;
        let i, arg, search;
        for (i = 0; i < args.length; i++) {
            arg = args[i];
            // If amount is non-negative, then must be waiting on a value.
            if (amt >= 0) {
                let type = MessageResponder_1.giveAmountBack(arg);
                // Breaks if not formatted correctly.
                if (type === null) {
                    return null;
                }
                // Make the amount part of this moneyed item.
                type.amount = amt;
                amt = -1;
                // Add to the fund.
                fund = MessageResponder_1.addToFund(type, fund);
                if (fund === null) {
                    return null;
                }
                continue;
            }
            // Check for negatives.
            if (arg.substr(0, 1) === "-") {
                negative = true;
                arg = arg.substr(1);
            }
            // Check for positives.
            if (arg.substr(0, 1) === "+") {
                arg = arg.substr(1);
            }
            let money = MessageResponder_1.giveAmountBack(arg);
            // Something strange happened.
            if (money === null) {
                return null;
            }
            if (money.type === null) {
                amt = money.amount;
                continue;
            }
            // Add to the fund.
            fund = MessageResponder_1.addToFund(money, fund);
            if (fund === null) {
                return null;
            }
        }
    }
    /**
     * Adds the given "Money" amount to the given fund.
     *
     * @param money
     * @param fund
     */
    static addToFund(money, fund) {
        switch (money.type) {
            case "platinum":
                fund.platinum = money.amount;
                break;
            case "gold":
                fund.gold = money.amount;
                break;
            case "silver":
                fund.silver = money.amount;
                break;
            case "copper":
                fund.copper = money.amount;
                break;
            default:
                return null;
        }
        return fund;
    }
    static searchForMoneyType(arg) {
        let place = arg.search("g");
        if (place >= 0) {
            const num = arg.substr(0, place + 1);
            return num + " gold";
        }
        place = arg.search("c");
        if (place >= 0) {
            const num = arg.substr(0, place + 1);
            return num + " copper";
        }
        place = arg.search("s");
        if (place >= 0) {
            const num = arg.substr(0, place + 1);
            return num + " silver";
        }
        place = arg.search("p");
        if (place >= 0) {
            const num = arg.substr(0, place + 1);
            return num + " platinum";
        }
        return arg;
    }
    /**
     *
     * @param arg
     */
    static giveAmountBack(arg) {
        const num = Number(arg);
        if (!isNaN(num)) {
            return { "amount": num, "type": null };
        }
        const type = MessageResponder_1.searchForMoneyType(arg);
        const args = type.split(" ");
        if (args.length < 2) {
            const maybeType = args[0];
            // See if it's a type.
            if (maybeType === "gold" || maybeType === "platinum" || maybeType === "silver" || maybeType === "copper") {
                return { "amount": null, "type": maybeType };
            }
            // Something weird.
            return null;
        }
        return { "amount": Number(args[0]), "type": args[1] };
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
MessageResponder = MessageResponder_1 = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.PingFinder)),
    __param(1, inversify_1.inject(types_1.TYPES.PartyService)),
    __metadata("design:paramtypes", [ping_finder_1.PingFinder,
        PartyService_1.PartyService])
], MessageResponder);
exports.MessageResponder = MessageResponder;
//# sourceMappingURL=message-responder.js.map