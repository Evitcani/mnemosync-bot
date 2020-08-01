import {Command} from "../../../shared/models/generic/Command";
import {Message} from "discord.js";
import {inject, injectable} from "inversify";
import {TYPES} from "../../../types";
import {PartyController} from "../../../backend/controllers/party/PartyController";
import {Subcommands} from "../../../shared/documentation/commands/Subcommands";
import {WorldController} from "../../../backend/controllers/world/WorldController";
import {AbstractUserCommandHandler} from "../base/AbstractUserCommandHandler";
import {UserController} from "../../../backend/controllers/user/UserController";

/**
 * Command to register a user as having access to the funds created on a specific server.
 */
@injectable()
export class RegisterCommandHandler extends AbstractUserCommandHandler {
    private partyController: PartyController;
    private userController: UserController;
    private worldController: WorldController;

    constructor(@inject(TYPES.PartyController) partyController: PartyController,
                @inject(TYPES.UserController) userController: UserController,
                @inject(TYPES.WorldController) worldController: WorldController) {
        super();
        this.partyController = partyController;
        this.userController = userController;
        this.worldController = worldController;
    }

    async handleUserCommand(command: Command, message: Message, user): Promise<Message | Message[]> {
        if (Subcommands.PARTY.isCommand(command)) {
            const createParty = Subcommands.PARTY.getCommand(command);
            return this.partyController.createNew(createParty.getInput(), message.guild.id, message.author.id)
                .then((party) => {
                    return message.channel.send("Created new party: " + party.name);
                });
        }

        return this.registerUserToGuild(command, message).then((res) => {
            if (!res) {
                return message.channel.send("Could not register user.");
            }
            return message.channel.send("You now have access to all funds registered to this server!")
        });
    }

    /**
     * Registers a user to a guild.
     *
     * @param command The processed command.
     * @param message The message used for this message.
     */
    async registerUserToGuild (command: Command, message: Message): Promise<boolean> {
        // TODO: Decide if we reimplement this.
        return Promise.resolve(false);
    }

}