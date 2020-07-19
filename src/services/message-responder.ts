import {Message} from "discord.js";
import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {Command} from "../models/generic/Command";
import {PartyFundCommandHandler} from "../command-handlers/PartyFundCommandHandler";
import {RegisterCommandHandler} from "../command-handlers/RegisterCommandHandler";
import {WhichCommandHandler} from "../command-handlers/WhichCommandHandler";
import {HelpCommandHandler} from "../command-handlers/HelpCommandHandler";
import {QuoteCommandHandler} from "../command-handlers/QuoteCommandHandler";
import {Commands} from "../documentation/commands/Commands";
import {CharacterCommandHandler} from "../command-handlers/CharacterCommandHandler";

@injectable()
export class MessageResponder {
    private characterCommandHandler: CharacterCommandHandler;
    private helpCommandHandler: HelpCommandHandler;
    private partyFundCommandHandler: PartyFundCommandHandler;
    private quoteCommandHandler: QuoteCommandHandler;
    private registerUserCommandHandler: RegisterCommandHandler;
    private whichCommandHandler: WhichCommandHandler;

    constructor(@inject(TYPES.CharacterCommandHandler) characterCommandHandler: CharacterCommandHandler,
                @inject(TYPES.HelpCommandHandler) helpCommandHandler: HelpCommandHandler,
                @inject(TYPES.PartyFundCommandHandler) partyFundCommandHandler: PartyFundCommandHandler,
                @inject(TYPES.QuoteCommandHandler) quoteCommandHandler: QuoteCommandHandler,
                @inject(TYPES.RegisterUserCommandHandler) registerUserCommandHandler: RegisterCommandHandler,
                @inject(TYPES.WhichCommandHandler) whichCommandHandler: WhichCommandHandler) {
        this.characterCommandHandler = characterCommandHandler;
        this.helpCommandHandler = helpCommandHandler;
        this.partyFundCommandHandler = partyFundCommandHandler;
        this.quoteCommandHandler = quoteCommandHandler;
        this.registerUserCommandHandler = registerUserCommandHandler;
        this.whichCommandHandler = whichCommandHandler;
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
            case Commands.BANK:
                return this.partyFundCommandHandler.handleCommand(command, message).then((msg) => {
                    message.delete({reason: "Bank command deletion."});
                    return msg;
                });
            case Commands.CHARACTER:
                return this.characterCommandHandler.handleCommand(command, message);
            case Commands.FUND:
                return this.partyFundCommandHandler.handleCommand(command, message).then((msg) => {
                    message.delete({reason: "Fund command deletion."});
                    return msg;
                });
            case Commands.HELP:
                return this.helpCommandHandler.handleCommand(command, message);
            case Commands.QUOTE:
                return this.quoteCommandHandler.handleCommand(command, message).then((msg) => {
                    message.delete({reason: "Quote command deletion."});
                    return msg;
                });
            case Commands.REGISTER:
                return this.registerUserCommandHandler.handleCommand(command, message);
            case Commands.WHICH:
                return this.whichCommandHandler.handleCommand(command, message).then((msg) => {
                    message.delete({reason: "Which command deletion."});
                    return msg;
                });
        }
    }
}