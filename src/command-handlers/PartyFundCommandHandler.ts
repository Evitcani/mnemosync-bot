import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {Message} from "discord.js";
import {MoneyUtility} from "../utilities/MoneyUtility";
import {PartyFund} from "../entity/PartyFund";
import {Command} from "../models/generic/Command";
import {FundRelatedClientResponses} from "../documentation/client-responses/FundRelatedClientResponses";
import {PartyFundService} from "../database/PartyFundService";
import {Commands} from "../documentation/commands/Commands";
import {PartyController} from "../controllers/PartyController";
import {Subcommands} from "../documentation/commands/Subcommands";
import {PartyFundController} from "../controllers/PartyFundController";
import {Party} from "../entity/Party";
import {AbstractUserCommandHandler} from "./base/AbstractUserCommandHandler";

/**
 * Manages the fund related commands.
 */
@injectable()
export class PartyFundCommandHandler extends AbstractUserCommandHandler {
    /** The party service to connect to the database. */
    private partyController: PartyController;
    /** Connection the fund database. */
    private partyFundService: PartyFundService;
    private partyFundController: PartyFundController;
    private readonly partyName: string = "The Seven Wonders";

    constructor(@inject(TYPES.PartyController) partyController: PartyController,
                @inject(TYPES.PartyFundController) partyFundController: PartyFundController,
                @inject(TYPES.PartyFundService) partyFundService: PartyFundService) {
        super();
        this.partyController = partyController;
        this.partyFundService = partyFundService;
        this.partyFundController = partyFundController;
    }

    /**
     * Handles the commands related to funds.
     *
     * @param command The command to handle.
     * @param message The message calling this command.
     */
    public async handleUserCommand(command, message, user): Promise<Message | Message[]> {
        // Figure out which command to use.
        let type = command.getName() == Commands.BANK ? "BANK" : "FUND";

        // If there are no args, assume the user just wants a bank statement.
        if (command.getInput() == null) {
            return this.getFunds(message, type, this.partyName);
        }

        const createCommand = Subcommands.CREATE.isCommand(command);
        if (createCommand != null) {
            return this.partyController.getByNameAndGuild(this.partyName, message.guild.id).then((parties) => {
                if (parties == null) {
                    return message.channel.send("No parties in this server.");
                }

                const party: Party = parties[0];

                return this.partyFundController.create(party, type).then(() => {
                    return message.channel.send("Created new party fund!");
                });
            });
        }

        // Now we send the amount off to be processed.
        return this.updateFunds(command, message, type, this.partyName);
    }

    private async getFunds(message: Message, type: string, name: string): Promise<Message | Message[]> {
        return this.findFunds(name, type, message).then((fund) => {
            let total = MoneyUtility.pileIntoCopper(fund) / 100;
            return message.channel.send(FundRelatedClientResponses.GET_MONEY(total, type, name));
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

        return this.partyController.getByNameAndGuild(name, message.guild.id).then((parties) => {
            if (parties == null || parties.length < 1) {
                return null;
            }

            let party = parties[0];

            return this.partyFundController.getByPartyAndType(party, type);
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
            if (fund == null) {
                return message.channel.send("Could not find fund!");
            }

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

            return this.partyFundService.updateFunds(fund.id, finalFund.platinum, finalFund.gold, finalFund.silver,
                finalFund.copper).then((updatedFund) => {
                    const currentMoney = MoneyUtility.pileIntoCopper(updatedFund) / 100;
                    return message.channel.send(FundRelatedClientResponses.UPDATED_MONEY(currentMoney,
                        oldAmt / 100, newAmtTotal /100, newAmtTotal < 0));
            });
        });
    }
}