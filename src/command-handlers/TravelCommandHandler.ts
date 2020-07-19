import {AbstractCommandHandler} from "./base/AbstractCommandHandler";
import {Command} from "../models/generic/Command";
import {Message} from "discord.js";

/**
 * The "travel" command is used to calculate the most efficient gear to travel with over a period of days.
 */
export class TravelCommandHandler extends AbstractCommandHandler {
    async handleCommand(command: Command, message: Message): Promise<Message | Message[]> {
        return undefined;
    }


}