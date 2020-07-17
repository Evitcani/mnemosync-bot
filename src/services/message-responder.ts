import {Message} from "discord.js";
import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {Command} from "../models/generic/Command";
import {PartyFundCommandHandler} from "../command-handlers/PartyFundCommandHandler";
import {RegisterUserCommandHandler} from "../command-handlers/RegisterUserCommandHandler";

@injectable()
export class MessageResponder {
    private partyFundCommandHandler: PartyFundCommandHandler;
    private registerUserCommandHandler: RegisterUserCommandHandler;

    constructor(@inject(TYPES.PartyFundCommandHandler) partyFundCommandHandler: PartyFundCommandHandler,
        @inject(TYPES.RegisterUserCommandHandler) registerUserCommandHandler: RegisterUserCommandHandler) {
        this.registerUserCommandHandler = registerUserCommandHandler;
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

        console.log("Command: " + cmd);

        // Determine which handler to call.
        switch (cmd) {
            case "bank":
                return this.partyFundCommandHandler.handleCommand(command, message);
            case "fund":
                return this.partyFundCommandHandler.handleCommand(command, message);
            case "register":
                return this.registerUserCommandHandler.handleCommand(command, message);
        }
    }
}