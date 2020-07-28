import {Message} from "discord.js";
import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {Command} from "../models/generic/Command";
import {PartyFundCommandHandler} from "../command-handlers/world/party/inventory/PartyFundCommandHandler";
import {RegisterCommandHandler} from "../command-handlers/misc/RegisterCommandHandler";
import {WhichCommandHandler} from "../command-handlers/world/information/WhichCommandHandler";
import {HelpCommandHandler} from "../command-handlers/misc/HelpCommandHandler";
import {QuoteCommandHandler} from "../command-handlers/misc/QuoteCommandHandler";
import {Commands} from "../documentation/commands/Commands";
import {CharacterCommandHandler} from "../command-handlers/world/party/character/CharacterCommandHandler";
import {UserController} from "../controllers/user/UserController";
import {WorldCommandHandler} from "../command-handlers/world/information/WorldCommandHandler";
import {SendingCommandHandler} from "../command-handlers/world/party/character/SendingCommandHandler";
import {CalendarCommandHandler} from "../command-handlers/world/information/CalendarCommandHandler";
import {DateCommandHandler} from "../command-handlers/world/information/DateCommandHandler";
import {PartyCommandHandler} from "../command-handlers/world/party/PartyCommandHandler";

@injectable()
export class MessageResponder {
    private calendarCommandHandler: CalendarCommandHandler;
    private characterCommandHandler: CharacterCommandHandler;
    private dateCommandHandler: DateCommandHandler;
    private helpCommandHandler: HelpCommandHandler;
    private partyCommandHandler: PartyCommandHandler;
    private partyFundCommandHandler: PartyFundCommandHandler;
    private quoteCommandHandler: QuoteCommandHandler;
    private registerUserCommandHandler: RegisterCommandHandler;
    private sendingCommandHandler: SendingCommandHandler;
    private whichCommandHandler: WhichCommandHandler;
    private worldCommandHandler: WorldCommandHandler;
    private userController: UserController;

    constructor(@inject(TYPES.CalendarCommandHandler) calendarCommandHandler: CalendarCommandHandler,
                @inject(TYPES.CharacterCommandHandler) characterCommandHandler: CharacterCommandHandler,
                @inject(TYPES.DateCommandHandler) dateCommandHandler: DateCommandHandler,
                @inject(TYPES.HelpCommandHandler) helpCommandHandler: HelpCommandHandler,
                @inject(TYPES.PartyFundCommandHandler) partyFundCommandHandler: PartyFundCommandHandler,
                @inject(TYPES.PartyCommandHandler) partyCommandHandler: PartyCommandHandler,
                @inject(TYPES.QuoteCommandHandler) quoteCommandHandler: QuoteCommandHandler,
                @inject(TYPES.RegisterUserCommandHandler) registerUserCommandHandler: RegisterCommandHandler,
                @inject(TYPES.SendingCommandHandler) sendingCommandHandler: SendingCommandHandler,
                @inject(TYPES.WhichCommandHandler) whichCommandHandler: WhichCommandHandler,
                @inject(TYPES.WorldCommandHandler) worldCommandHandler: WorldCommandHandler,
                @inject(TYPES.UserController) userController: UserController) {
        this.calendarCommandHandler = calendarCommandHandler;
        this.characterCommandHandler = characterCommandHandler;
        this.dateCommandHandler = dateCommandHandler;
        this.helpCommandHandler = helpCommandHandler;
        this.partyCommandHandler = partyCommandHandler;
        this.partyFundCommandHandler = partyFundCommandHandler;
        this.quoteCommandHandler = quoteCommandHandler;
        this.registerUserCommandHandler = registerUserCommandHandler;
        this.sendingCommandHandler = sendingCommandHandler;
        this.whichCommandHandler = whichCommandHandler;
        this.worldCommandHandler = worldCommandHandler;
        this.userController = userController;
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

        // Commands that do not require the user.
        switch (cmd) {
            case Commands.HELP:
                return this.helpCommandHandler.handleCommand(command, message);
            case Commands.QUOTE:
                return this.quoteCommandHandler.handleCommand(command, message).then((msg) => {
                    message.delete({reason: "Quote command deletion."});
                    return msg;
                });
        }

        return message.channel.send("Processing command...").then((msg) => {
            return this.processUserCommand(command, message).then((retMsg) => {
                msg.delete({reason: "Delete processed command."});
                return retMsg;
            });
        });
    }

    private async processUserCommand(command: Command, message: Message): Promise<Message | Message[]> {
        // Get the base command.
        const cmd = command.getName();

        return this.userController.get(message.author.id, message.author.username).then((user) => {
            // Determine which handler to call.
            switch (cmd) {
                case Commands.BANK:
                    return this.partyFundCommandHandler.handleUserCommand(command, message, user).then((msg) => {
                        message.delete({reason: "Bank command deletion."});
                        return msg;
                    });
                case Commands.CALENDAR:
                    return this.calendarCommandHandler.handleUserCommand(command, message, user);
                case Commands.CHARACTER:
                    return this.characterCommandHandler.handleUserCommand(command, message, user);
                case Commands.DATE:
                    return this.dateCommandHandler.handleUserCommand(command, message, user);
                case Commands.FUND:
                    return this.partyFundCommandHandler.handleUserCommand(command, message, user).then((msg) => {
                        message.delete({reason: "Fund command deletion."});
                        return msg;
                    });
                case Commands.PARTY:
                    return this.partyCommandHandler.handleUserCommand(command, message, user);
                case Commands.REGISTER:
                    return this.registerUserCommandHandler.handleUserCommand(command, message, user);
                case Commands.SENDING:
                    return this.sendingCommandHandler.handleUserCommand(command, message, user);
                case Commands.WHICH:
                    return this.whichCommandHandler.handleUserCommand(command, message, user).then((msg) => {
                        message.delete({reason: "Which command deletion."});
                        return msg;
                    });
                case Commands.WORLD:
                    return this.worldCommandHandler.handleUserCommand(command, message, user);
            }
        });
    }
}