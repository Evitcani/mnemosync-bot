import {AbstractUserCommandHandler} from "../../base/AbstractUserCommandHandler";
import {injectable} from "inversify";
import {Command} from "../../../models/generic/Command";
import {Message} from "discord.js";
import {User} from "../../../entity/User";

@injectable()
export class PartyCommandHandler extends AbstractUserCommandHandler {
    async handleUserCommand(command: Command, message: Message, user: User): Promise<Message | Message[]> {
        return undefined;
    }


}