import {injectable} from "inversify";
import {AbstractCommandHandler} from "../base/AbstractCommandHandler";
import {Command} from "../../models/generic/Command";
import {Message} from "discord.js";
import {HelpDocumentation} from "../../documentation/commands/help/HelpDocumentation";

@injectable()
export class HelpCommandHandler extends AbstractCommandHandler {
    async handleCommand(command: Command, message: Message): Promise<Message | Message[]> {
        let input = command.getInput();

        if (input == null) {
            return message.channel.send(HelpDocumentation.get());
        }

        return message.channel.send(HelpDocumentation.find(input));
    }

}