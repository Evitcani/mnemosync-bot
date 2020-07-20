import {AbstractCommandHandler} from "./base/AbstractCommandHandler";
import {Command} from "../models/generic/Command";
import {Message} from "discord.js";
import {Character} from "../entity/Character";

/**
 * The "travel" command is used to calculate the most efficient gear to travel with over a period of days.
 */
export class TravelCommandHandler extends AbstractCommandHandler {
    async handleCommand(command: Command, message: Message): Promise<Message | Message[]> {
        return undefined;
    }

    /**
     * Gets all party members in the given party.
     *
     * @param partyId The party ID to fetch all the members of.
     */
    private async getPartyMembers(partyId: number): Promise<Character[]> {
        return undefined;
    }
}