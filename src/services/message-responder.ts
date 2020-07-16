import {Message} from "discord.js";
import {PingFinder} from "./ping-finder";
import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {PartyService} from "../database/PartyService";
import {PartyFund} from "../database/models/PartyFund";
import {Money} from "../database/models/Money";

@injectable()
export class MessageResponder {
    private pingFinder: PingFinder;
    private partyService: PartyService;

    constructor(@inject(TYPES.PingFinder) pingFinder: PingFinder,
                @inject(TYPES.PartyService) partyService: PartyService) {
        this.pingFinder = pingFinder;
        this.partyService = partyService;
    }

    /**
     * Figures out which subcommand to send the message to.
     *
     * @param message
     * @param args
     */
    async bankCommand(message: Message, args: string[]): Promise<Message | Message[]> {
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
    }

    private async getBankFunds(message: Message): Promise<Message | Message[]> {
        return this.findFunds("BANK").then((fund) => {
            return message.channel.send(this.formatFundStatement(fund, fund.type));
        });
    }

    /**
     * Updates the amount of money in the shared bank account.
     *
     * @param message The message sent.
     * @param args The other arguments.
     */
    private async updateBankFunds(message: Message, args: string[]): Promise<Message | Message[]> {
        // Process the arguments.

        return this.findFunds("BANK").then((fund) => {
            return message.channel.send(this.formatFundStatement(fund, fund.type));
        });
    }

    handle(message: Message): Promise<Message | Message[]> {
        if (this.pingFinder.isPing(message.content)) {
            return this.partyService.getParty("The Seven Wonders").then((res) => {
                return message.channel.send('Pong right back at ya, ' + res.name + "!");
            });
        }

        return Promise.reject();
    }

    private async findFunds (type: string): Promise<PartyFund> {
        return this.partyService.getParty("The Seven Wonders").then((res) => {
            return this.partyService.getFund(res.id, type).catch((err: Error) => {
                console.log("Failed to find party fund with given information ::: " + err.message);
                return null;
            });
        }).catch((err: Error) => {
            console.log("Failed to find party with given name ::: " + err.message);
            return null;
        });
    }

    private processMoneyArguments (args: string[]): PartyFund {
        let fund: PartyFund = {id: null, party_id: null, type: null, platinum: null, gold: null, silver: null, copper: null};
        let amt = -1;
        let negative = false;
        let i: number, arg: string, search: number;
        for (i = 0; i < args.length; i++) {
            arg = args[i];

            // If amount is non-negative, then must be waiting on a value.
            if (amt >= 0) {
                let type = MessageResponder.giveAmountBack(arg);

                // Breaks if not formatted correctly.
                if (type === null) {
                    return null;
                }

                // Make the amount part of this moneyed item.
                type.amount = amt;
                amt = -1;

                // Add to the fund.
                fund = MessageResponder.addToFund(type, fund);
                if (fund === null) {
                    return null;
                }
                continue;
            }

            // Check for negatives.
            if (arg.substr(0,1) === "-") {
                negative = true;
                arg = arg.substr(1);
            }

            // Check for positives.
            if (arg.substr(0,1) === "+") {
                arg = arg.substr(1);
            }

            let money: Money = MessageResponder.giveAmountBack(arg);

            // Something strange happened.
            if (money === null) {
                return null;
            }

            if (money.type === null) {
                amt = money.amount;
                continue;
            }

            // Add to the fund.
            fund = MessageResponder.addToFund(money, fund);
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
    private static addToFund (money: Money, fund: PartyFund): PartyFund {
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

    private static searchForMoneyType (arg: string): string {
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
    private static giveAmountBack(arg: string): Money {
        const num = Number(arg);
        if (!isNaN(num)) {
            return {"amount": num, "type": null};
        }

        const type = MessageResponder.searchForMoneyType(arg);
        const args = type.split(" ");
        if (args.length < 2) {
            const maybeType = args[0];

            // See if it's a type.
            if (maybeType === "gold" || maybeType === "platinum" || maybeType === "silver" || maybeType === "copper") {
                return {"amount": null, "type": maybeType};
            }

            // Something weird.
            return null;
        }

        return {"amount": Number(args[0]), "type": args[1]};
    }

    private formatFundStatement (fund: PartyFund, type: string | null): string {
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
}