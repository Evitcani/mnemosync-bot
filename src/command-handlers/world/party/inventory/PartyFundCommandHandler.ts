import {inject, injectable} from "inversify";
import {TYPES} from "../../../../types";
import {Message} from "discord.js";
import {MoneyUtility} from "../../../../utilities/MoneyUtility";
import {PartyFund} from "../../../../entity/PartyFund";
import {Command} from "../../../../models/generic/Command";
import {FundRelatedClientResponses} from "../../../../documentation/client-responses/party/FundRelatedClientResponses";
import {PartyFundService} from "../../../../database/PartyFundService";
import {Commands} from "../../../../documentation/commands/Commands";
import {PartyController} from "../../../../controllers/party/PartyController";
import {Subcommands} from "../../../../documentation/commands/Subcommands";
import {PartyFundController} from "../../../../controllers/party/PartyFundController";
import {Party} from "../../../../entity/Party";
import {AbstractUserCommandHandler} from "../../../base/AbstractUserCommandHandler";
import {User} from "../../../../entity/User";

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
     * @param user
     */
    public async handleUserCommand(command, message, user): Promise<Message | Message[]> {
        if (user == null || user.defaultCharacter == null) {
            return message.channel.send(FundRelatedClientResponses.NO_DEFAULT_CHARACTER());
        }

        if (user.defaultCharacter.party == null) {
            return message.channel.send(FundRelatedClientResponses.CHARACTER_NOT_IN_PARTY(user.defaultCharacter.name));
        }

        // Figure out which command to use.
        let type = command.getName() == Commands.BANK ? "BANK" : "FUND";

        // If there are no args, assume the user just wants a bank statement.
        if (command.getInput() == null) {
            return this.getFunds(message, type, user);
        }

        const createCommand = Subcommands.CREATE.isCommand(command);
        if (createCommand != null) {
            return this.partyFundController.create(user.defaultCharacter.party, type).then(() => {
                return message.channel.send("Created new party fund!");
            });
        }

        // Now we send the amount off to be processed.
        return this.updateFunds(command, message, type, user.defaultCharacter.party);
    }

    private async getFunds(message: Message, type: string, user: User): Promise<Message | Message[]> {
        return this.findFunds(user.defaultCharacter.party, type, message).then((fund) => {
            let total = MoneyUtility.pileIntoCopper(fund) / 100;
            return message.channel.send(FundRelatedClientResponses.GET_MONEY(total, type, user.defaultCharacter.party.name));
        });
    }

    ////////////////////////////////////////////////////////////
    ///// FINDING
    ////////////////////////////////////////////////////////////

    /**
     * Finds the fund for the given party of the given type.
     *
     * @param party
     * @param type The type of fund to find. Defaults to 'FUND'.
     * @param message The message object that originally sent the command.
     */
    private async findFunds (party: Party, type: string | null, message: Message): Promise<PartyFund> {
        if (type == null) {
            type = "FUND";
        }

        return this.partyFundController.getByPartyAndType(party, type);
    }

    ////////////////////////////////////////////////////////////
    ///// UPDATING
    ////////////////////////////////////////////////////////////

    private async updateFunds(command: Command, message: Message, fundType: string, party: Party): Promise<Message | Message[]> {
        // Process the arguments.
        const newFund = MoneyUtility.processMoneyArguments(command.getInput().split(" "));

        if (newFund === null) {
            return message.channel.send("Command appears to be formatted incorrectly. Please try again!");
        }

        // Find and then update these funds.
        return this.findFunds(party, fundType, message).then((fund) => {
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