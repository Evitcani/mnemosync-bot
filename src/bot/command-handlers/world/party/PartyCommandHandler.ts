import {AbstractUserCommandHandler} from "../../base/AbstractUserCommandHandler";
import {inject, injectable} from "inversify";
import {Command} from "../../../../shared/models/generic/Command";
import {Message} from "discord.js";
import {User} from "../../../../entity/User";
import {Subcommands} from "../../../../shared/documentation/commands/Subcommands";
import {TYPES} from "../../../../types";
import {PartyController} from "../../../../backend/controllers/party/PartyController";
import {UserController} from "../../../../backend/controllers/user/UserController";
import {Party} from "../../../../entity/Party";

@injectable()
export class PartyCommandHandler extends AbstractUserCommandHandler {
    private partyController: PartyController;
    private userController: UserController;

    constructor(@inject(TYPES.PartyController) partyController: PartyController,
                @inject(TYPES.UserController) userController: UserController) {
        super();
        this.partyController = partyController;
        this.userController = userController;
    }

    async handleUserCommand(command: Command, message: Message, user: User): Promise<Message | Message[]> {
        if (Subcommands.SWITCH.isCommand(command)) {
            return this.handleSwitchCommand(command, message, user);
        }

        return undefined;
    }

    private async handleSwitchCommand(command: Command, message: Message, user: User): Promise<Message | Message[]> {
        let ptCmd = Subcommands.SWITCH.getCommand(command);
        if (ptCmd.getInput() == null) {
            user.defaultParty = null;
            await this.userController.save(user);
            return message.channel.send("Removed default party.");
        }

        let parties = await this.partyController.getByNameAndGuild(ptCmd.getInput(), message.guild.id);
        if (parties.length <= 0) {
            return message.channel.send("Could not find party with that name.");
        }

        let party: Party;
        if (parties.length == 1) {
            party = parties[0];
        } else {
            party = await this.partyController.partySelection(parties, "switch to", message);
        }

        if (party == null) {
            return null;
        }

        user.defaultParty = party;

        await this.userController.save(user);

        return message.channel.send("Switched default party to: " + party.name);
    }
}