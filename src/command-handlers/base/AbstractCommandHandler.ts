import {Message} from "discord.js";
import {Command} from "../../models/generic/Command";
import {injectable} from "inversify";

@injectable()
export abstract class AbstractCommandHandler {
    abstract async handleCommand (command: Command, message: Message): Promise<Message | Message[]>;
}