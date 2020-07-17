import {injectable} from "inversify";
import {AbstractCommandHandler} from "./base/AbstractCommandHandler";
import {Command} from "../models/generic/Command";
import {Message} from "discord.js";

/**
 * Handles the "quote" command from users. This command allows a user to designate a channel as the "quote" channel and
 * then fetch random quotes from it.
 */
@injectable()
export class QuoteCommandHandler extends AbstractCommandHandler {
    async handleCommand(command: Command, message: Message): Promise<Message | Message[]> {
        return undefined;
    }

}