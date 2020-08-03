import {inject, injectable} from "inversify";
import {TYPES} from "../../../../../types";
import {Message} from "discord.js";
import {Command} from "../../../../../shared/models/generic/Command";
import {FundRelatedClientResponses} from "../../../../../shared/documentation/client-responses/party/FundRelatedClientResponses";
import {Commands} from "../../../../../shared/documentation/commands/Commands";
import {PartyController} from "../../../../../backend/controllers/party/PartyController";
import {Subcommands} from "../../../../../shared/documentation/commands/Subcommands";
import {PartyFundController} from "../../../../../backend/controllers/party/PartyFundController";
import {AbstractUserCommandHandler} from "../../../base/AbstractUserCommandHandler";
import {UserDTO} from "@evitcani/mnemoshared/dist/src/dto/model/UserDTO";
import {PartyDTO} from "@evitcani/mnemoshared/dist/src/dto/model/PartyDTO";
import {MoneyUtility} from "@evitcani/mnemoshared/dist/src/utilities/MoneyUtility";
import {PartyFundDTO} from "@evitcani/mnemoshared/dist/src/dto/model/PartyFundDTO";

/**
 * Manages the fund related commands.
 */
@injectable()
export class PartyFundCommandHandler extends AbstractUserCommandHandler {
    /** The party service to connect to the database. */
    private partyController: PartyController;
    /** Connection the fund database. */
    private partyFundController: PartyFundController;

    constructor(@inject(TYPES.PartyController) partyController: PartyController,
                @inject(TYPES.PartyFundController) partyFundController: PartyFundController) {
        super();
        this.partyController = partyController;
        this.partyFundController = partyFundController;
    }

    /**
     * Handles the commands related to funds.
     *
     * @param command The command to handle.
     * @param message The message calling this command.
     * @param user
     */
    public async handleUserCommand(command, message, user: UserDTO): Promise<Message | Message[]> {
        if (user == null || user.defaultCharacterId == null) {
            console.log(user);
            return message.channel.send(FundRelatedClientResponses.NO_DEFAULT_CHARACTER());
        }

        let party: PartyDTO = await this.partyController.getByCharacter(user.defaultCharacterId);

        if (party == null) {
            console.log(party);
            return message.channel.send(FundRelatedClientResponses.CHARACTER_NOT_IN_PARTY(user.defaultCharacterId));
        }

        // Figure out which command to use.
        let type = command.getName() == Commands.BANK ? "BANK" : "FUND";

        // If there are no args, assume the user just wants a bank statement.
        if (command.getInput() == null) {
            return this.getFunds(message, type, party);
        }

        const createCommand = Subcommands.CREATE.isCommand(command);
        if (createCommand) {
            return this.partyFundController.createNew(party.id, type).then(() => {
                return message.channel.send("Created new party fund!");
            });
        }

        // Now we send the amount off to be processed.
        return this.updateFunds(command, message, type, party.id);
    }

    private async getFunds(message: Message, type: string, party: PartyDTO): Promise<Message | Message[]> {
        return this.findFunds(party.id, type, message).then((fund) => {
            let total = MoneyUtility.pileIntoCopper(fund) / 100;
            return message.channel.send(FundRelatedClientResponses.GET_MONEY(total, type, party.name));
        });
    }

    ////////////////////////////////////////////////////////////
    ///// FINDING
    ////////////////////////////////////////////////////////////

    /**
     * Finds the fund for the given party of the given type.
     *
     * @param partyId
     * @param type The type of fund to find. Defaults to 'FUND'.
     * @param message The message object that originally sent the command.
     */
    private async findFunds (partyId: number, type: string | null, message: Message): Promise<PartyFundDTO> {
        if (type == null) {
            type = "FUND";
        }

        return this.partyFundController.getByPartyAndType(partyId, type);
    }

    ////////////////////////////////////////////////////////////
    ///// UPDATING
    ////////////////////////////////////////////////////////////

    private async updateFunds(command: Command, message: Message, fundType: string, partyId: number): Promise<Message | Message[]> {
        // Process the arguments.
        const newFund = MoneyUtility.processMoneyArguments(command.getInput().split(" "));

        if (newFund === null) {
            return message.channel.send("Command appears to be formatted incorrectly. Please try again!");
        }

        // Find and then update these funds.
        let fund: PartyFundDTO = await this.findFunds(partyId, fundType, message);

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
        fund.platinum = finalFund.platinum;
        fund.gold = finalFund.gold;
        fund.silver = finalFund.silver;
        fund.copper = finalFund.copper;

        let updatedFund = await this.partyFundController.updateFunds(partyId, fund);

        const currentMoney = MoneyUtility.pileIntoCopper(updatedFund) / 100;
        return message.channel.send(FundRelatedClientResponses.UPDATED_MONEY(currentMoney,
            oldAmt / 100, newAmtTotal /100, newAmtTotal < 0));
    }
}