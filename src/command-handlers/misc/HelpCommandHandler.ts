import {injectable} from "inversify";
import {AbstractCommandHandler} from "../base/AbstractCommandHandler";
import {Command} from "../../models/generic/Command";
import {Message} from "discord.js";

@injectable()
export class HelpCommandHandler extends AbstractCommandHandler {
    async handleCommand(command: Command, message: Message): Promise<Message | Message[]> {
        return undefined;
    }

}