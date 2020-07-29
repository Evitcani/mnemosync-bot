import {Command} from "../../../../shared/models/generic/Command";
import {Message} from "discord.js";
import {Character} from "../../../../backend/entity/Character";
import {AbstractUserCommandHandler} from "../../base/AbstractUserCommandHandler";
import {injectable} from "inversify";

/**
 * The "travel" command is used to calculate the most efficient gear to travel with over a period of days.
 */
@injectable()
export class TravelCommandHandler extends AbstractUserCommandHandler {
    async handleUserCommand(command: Command, message, user): Promise<Message | Message[]> {
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