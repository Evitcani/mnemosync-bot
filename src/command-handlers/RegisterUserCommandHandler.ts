import {AbstractCommandHandler} from "./base/AbstractCommandHandler";
import {Command} from "../models/generic/Command";
import {Message} from "discord.js";
import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {PartyService} from "../database/PartyService";
import {PartyFundService} from "../database/PartyFundService";
import {UserDefaultPartyService} from "../database/UserDefaultPartyService";

/**
 * Command to register a user as having access to the funds created on a specific server.
 */
@injectable()
export class RegisterUserCommandHandler extends AbstractCommandHandler {
    private userDefaultPartyService: UserDefaultPartyService;

    constructor(@inject(TYPES.UserDefaultPartyService) userDefaultPartyService: UserDefaultPartyService) {
        super();
        this.userDefaultPartyService = userDefaultPartyService;
    }

    async handleCommand(command: Command, message: Message): Promise<Message | Message[]> {
        const user = message.author;
        const guild = message.guild.id;

        // First check that the user already exists.
        return this.userDefaultPartyService.getDefaultParty(guild, user.id).then((res) => {
            console.log("Number is: " + res);

            return message.channel.send("Found result for user!");
        });
    }

}