import {inject, injectable} from "inversify";
import {PartyService} from "../database/PartyService";
import {TYPES} from "../types";
import {AbstractCommandHandler} from "./base/AbstractCommandHandler";
import {Command} from "../models/generic/Command";
import {Message} from "discord.js";
import {WhichRelatedClientResponses} from "../documentation/client-responses/WhichRelatedClientResponses";
import {PartyController} from "../controllers/PartyController";

/**
 * Handles questions about the state of the world.
 */
@injectable()
export class WhichCommandHandler extends AbstractCommandHandler {
    private partyController: PartyController;

    constructor(@inject(TYPES.PartyController) partyController: PartyController) {
        super();
        this.partyController = partyController;
    }

    async handleCommand(command: Command, message: Message): Promise<Message | Message[]> {
        return this.partyController.getByGuild(message.guild.id).then((res) => {
            return message.channel.send(WhichRelatedClientResponses.LIST_ALL_PARTIES(res));
        });
    }
}