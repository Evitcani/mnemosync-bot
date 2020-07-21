import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {Command} from "../models/generic/Command";
import {Message} from "discord.js";
import {WhichRelatedClientResponses} from "../documentation/client-responses/WhichRelatedClientResponses";
import {PartyController} from "../controllers/PartyController";
import {AbstractUserCommandHandler} from "./base/AbstractUserCommandHandler";

/**
 * Handles questions about the state of the world.
 */
@injectable()
export class WhichCommandHandler extends AbstractUserCommandHandler {
    private partyController: PartyController;

    constructor(@inject(TYPES.PartyController) partyController: PartyController) {
        super();
        this.partyController = partyController;
    }

    async handleUserCommand(command, message, user): Promise<Message | Message[]> {
        return this.partyController.getByGuild(message.guild.id).then((res) => {
            return message.channel.send(WhichRelatedClientResponses.LIST_ALL_PARTIES(res));
        });
    }
}