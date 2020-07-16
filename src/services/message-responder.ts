import {Message} from "discord.js";
import {PingFinder} from "./ping-finder";
import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {PartyService} from "../database/PartyService";
import {PartyFund} from "../database/models/PartyFund";
import {Money} from "../database/models/Money";
import {MoneyUtility} from "../utilities/MoneyUtility";

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
            return message.channel.send(MoneyUtility.formatFundStatement(fund, fund.type));
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
        const newFund = MoneyUtility.processMoneyArguments(args);

        if (newFund === null) {
            return message.channel.send("Command appears to be formatted incorrectly. Please try again!");
        }

        // Find and then update these funds.
        return this.findFunds("BANK").then((fund) => {
            // Pile everything into copper.
            let newAmt = MoneyUtility.pileIntoCopper(newFund);
            let oldAmt = MoneyUtility.pileIntoCopper(fund);

            newAmt += oldAmt;

            if (newAmt < 0) {
                let newAmtInGold = newAmt / 100;
                return message.channel.send("You don't have enough money to do that! You are short " +
                    newAmtInGold + " gp!");
            }

            const finalFund = MoneyUtility.copperToFund(newAmt);

            return this.partyService.updateFunds(fund.id, finalFund.platinum, finalFund.gold, finalFund.silver,
                finalFund.copper).then((updatedFund) => {
                return message.channel.send(MoneyUtility.formatFundStatement(updatedFund, updatedFund.type));
            }).catch((err: Error) => {
                console.log("ERROR: COULD NOT UPDATE FUNDS ::: " + err.message);
                console.log(err.stack);
                return null;
            });
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
}