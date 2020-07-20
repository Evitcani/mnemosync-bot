import {AbstractCommandHandler} from "./base/AbstractCommandHandler";
import {Command} from "../models/generic/Command";
import {Message} from "discord.js";
import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {UserDefaultPartyService} from "../database/UserDefaultPartyService";
import {UserService} from "../database/UserService";
import {UserToGuildService} from "../database/UserToGuildService";
import {PartyController} from "../controllers/PartyController";
import {Subcommands} from "../documentation/commands/Subcommands";

/**
 * Command to register a user as having access to the funds created on a specific server.
 */
@injectable()
export class RegisterCommandHandler extends AbstractCommandHandler {
    private partyController: PartyController;
    private userDefaultPartyService: UserDefaultPartyService;
    private userService: UserService;
    private userToGuildService: UserToGuildService;

    constructor(@inject(TYPES.PartyController) partyController: PartyController,
                @inject(TYPES.UserDefaultPartyService) userDefaultPartyService: UserDefaultPartyService,
                @inject(TYPES.UserService) userService: UserService,
                @inject(TYPES.UserToGuildService) userToGuildService: UserToGuildService) {
        super();
        this.partyController = partyController;
        this.userDefaultPartyService = userDefaultPartyService;
        this.userService = userService;
        this.userToGuildService = userToGuildService;
    }

    async handleCommand(command: Command, message: Message): Promise<Message | Message[]> {
        const createParty = Subcommands.PARTY.isCommand(command);
        if (createParty != null) {
            return this.partyController.create(createParty.getInput(), message.guild.id, message.author.id)
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
        const user = message.author;
        const guild = message.guild.id;

        // First get the user.
        return this.userService.getUser(user.id, user.username).then((res) => {
            if (res == null) {
                return false;
            }
            return this.userToGuildService.registerUserOnGuild(guild, user.id).then((map) => {
                return map != null;
            });
        })
    }

}