import {PartyService} from "../database/PartyService";
import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {Message} from "discord.js";
import {MoneyUtility} from "../utilities/MoneyUtility";
import {AbstractCommandHandler} from "./base/AbstractCommandHandler";
import {PartyFund} from "../models/database/PartyFund";
import {Command} from "../models/generic/Command";
import {FundRelatedClientResponses} from "../documentation/client-responses/FundRelatedClientResponses";

/**
 * Manages the fund related commands.
 */
@injectable()
export class PartyFundCommandHandler extends AbstractCommandHandler {
    /** The party service to connect to the database. */
    private partyService: PartyService;
    private readonly partyName: string = "The Seven Wonders";

    constructor(@inject(TYPES.PartyService) partyService: PartyService) {
        super();
        this.partyService = partyService;
    }

    /**
     * Handles the commands related to funds.
     *
     * @param command The command to handle.
     * @param message The message calling this command.
     */
    public async handleCommand (command: Command, message: Message): Promise<Message | Message[]> {
        // Figure out which command to use.
        let type = command.getName() == "bank" ? "BANK" : "FUND";

        // If there are no args, assume the user just wants a bank statement.
        if (command.getInput() == null) {
            return this.getFunds(message, type, this.partyName);
        }

        // Now we send the amount off to be processed.
        return this.updateFunds(command, message, type, this.partyName);
    }

    private async getFunds(message: Message, type: string, name: string): Promise<Message | Message[]> {
        return this.findFunds(name, type, message).then((fund) => {
            return message.channel.send(MoneyUtility.formatFundStatement(fund, fund.type));
        });
    }

    ////////////////////////////////////////////////////////////
    ///// FINDING
    ////////////////////////////////////////////////////////////

    /**
     * Finds the fund for the given party of the given type.
     *
     * @param name The name of the party that the fund belongs to.
     * @param type The type of fund to find. Defaults to 'FUND'.
     * @param message The message object that originally sent the command.
     */
    private async findFunds (name: string, type: string | null, message: Message): Promise<PartyFund> {
        if (type == null) {
            type = "FUND";
        }

        return this.partyService.getParty(name).then((res) => {
            return this.partyService.getFund(res.id, type).catch((err: Error) => {
                console.log("Failed to find party fund with given information ::: " + err.message);
                return err;
            });
        }).catch((err: Error) => {
            console.log("Failed to find party with given name ::: " + err.message);
            return null;
        });
    }

    ////////////////////////////////////////////////////////////
    ///// UPDATING
    ////////////////////////////////////////////////////////////

    private async updateFunds(command: Command, message: Message, fundType: string, partyName: string): Promise<Message | Message[]> {
        // Process the arguments.
        const newFund = MoneyUtility.processMoneyArguments(command.getInput().split(" "));

        if (newFund === null) {
            return message.channel.send("Command appears to be formatted incorrectly. Please try again!");
        }

        // Find and then update these funds.
        return this.findFunds(partyName, fundType, message).then((fund) => {
            // Pile everything into copper.
            let newAmtTotal = MoneyUtility.pileIntoCopper(newFund);
            let oldAmt = MoneyUtility.pileIntoCopper(fund);

            let newAmt = newAmtTotal + oldAmt;

            if (newAmt < 0) {
                let newAmtInGold = newAmt / 100;
                return message.channel.send(FundRelatedClientResponses.NOT_ENOUGH_MONEY(oldAmt / 100,
                    newAmtTotal / 100, newAmtInGold));
            }

            const finalFund = MoneyUtility.copperToFund(newAmt);

            return this.partyService.updateFunds(fund.id, finalFund.platinum, finalFund.gold, finalFund.silver,
                finalFund.copper).then((updatedFund) => {
                return message.channel.send(MoneyUtility.formatFundStatement(updatedFund, updatedFund.type));
            });
        });
    }
}