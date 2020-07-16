import {Message} from "discord.js";
import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {PartyService} from "../database/PartyService";
import {Command} from "../models/generic/Command";
import {PartyFundCommandHandler} from "../command-handlers/PartyFundCommandHandler";

@injectable()
export class MessageResponder {
    private partyFundCommandHandler: PartyFundCommandHandler;

    constructor(@inject(TYPES.PartyFundCommandHandler) partyFundCommandHandler: PartyFundCommandHandler) {
        this.partyFundCommandHandler = partyFundCommandHandler;
    }

    /**
     * Handles all incoming commands.
     *
     * @param command The processed commands to look at.
     * @param message The message object doing the command.
     */
    async handle (command: Command, message: Message): Promise<Message | Message[]>{
        // Get the base command.
        const cmd = command.getName();

        // Determine which handler to call.
        switch (cmd) {
            case "bank" || "fund":
                return this.partyFundCommandHandler.handleCommand(command, message);
            default:
                return message.channel.send("Unknown command. Try typing `$help` to see all commands.");
        }
    }
}