import {inject, injectable} from "inversify";
import {PartyService} from "../database/PartyService";
import {TYPES} from "../types";
import {AbstractCommandHandler} from "./base/AbstractCommandHandler";
import {Command} from "../models/generic/Command";
import {Message} from "discord.js";
import {WhichRelatedClientResponses} from "../documentation/client-responses/WhichRelatedClientResponses";

/**
 * Handles questions about the state of the world.
 */
@injectable()
export class WhichCommandHandler extends AbstractCommandHandler {
    private partyService: PartyService;

    constructor(@inject(TYPES.PartyService) partyService: PartyService) {
        super();
        this.partyService = partyService;
    }

    async handleCommand(command: Command, message: Message): Promise<Message | Message[]> {


        return this.partyService.getPartiesInGuild(message.guild.id).then((res) => {
            return message.channel.send(WhichRelatedClientResponses.LIST_ALL_PARTIES(res));
        });
    }
}