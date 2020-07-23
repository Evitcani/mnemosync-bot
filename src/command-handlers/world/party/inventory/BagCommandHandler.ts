import {Message} from "discord.js";
import {AbstractUserCommandHandler} from "../../../base/AbstractUserCommandHandler";
import {injectable} from "inversify";

@injectable()
export class BagCommandHandler extends AbstractUserCommandHandler {
    async handleUserCommand(command, message, user): Promise<Message | Message[]> {
        return undefined;
    }

}