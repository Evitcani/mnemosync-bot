"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageResponder = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../types");
const PartyFundCommandHandler_1 = require("../command-handlers/world/party/inventory/PartyFundCommandHandler");
const RegisterCommandHandler_1 = require("../command-handlers/misc/RegisterCommandHandler");
const WhichCommandHandler_1 = require("../command-handlers/world/information/WhichCommandHandler");
const HelpCommandHandler_1 = require("../command-handlers/misc/HelpCommandHandler");
const QuoteCommandHandler_1 = require("../command-handlers/misc/QuoteCommandHandler");
const Commands_1 = require("../documentation/commands/Commands");
const CharacterCommandHandler_1 = require("../command-handlers/world/party/character/CharacterCommandHandler");
const UserController_1 = require("../controllers/user/UserController");
const WorldCommandHandler_1 = require("../command-handlers/world/information/WorldCommandHandler");
const SendingCommandHandler_1 = require("../command-handlers/world/party/character/SendingCommandHandler");
const CalendarCommandHandler_1 = require("../command-handlers/world/information/CalendarCommandHandler");
const DateCommandHandler_1 = require("../command-handlers/world/information/DateCommandHandler");
const PartyCommandHandler_1 = require("../command-handlers/world/party/PartyCommandHandler");
let MessageResponder = class MessageResponder {
    constructor(calendarCommandHandler, characterCommandHandler, dateCommandHandler, helpCommandHandler, partyFundCommandHandler, partyCommandHandler, quoteCommandHandler, registerUserCommandHandler, sendingCommandHandler, whichCommandHandler, worldCommandHandler, userController) {
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
    handle(command, message) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get the base command.
            const cmd = command.getName();
            console.log("Command: " + cmd);
            // Commands that do not require the user.
            switch (cmd) {
                case Commands_1.Commands.HELP:
                    return this.helpCommandHandler.handleCommand(command, message);
                case Commands_1.Commands.QUOTE:
                    return this.quoteCommandHandler.handleCommand(command, message).then((msg) => {
                        message.delete({ reason: "Quote command deletion." });
                        return msg;
                    });
            }
            return message.channel.send("Processing command...").then((msg) => {
                return this.processUserCommand(command, message).then((retMsg) => {
                    msg.delete({ reason: "Delete processed command." });
                    return retMsg;
                });
            });
        });
    }
    processUserCommand(command, message) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get the base command.
            const cmd = command.getName();
            return this.userController.get(message.author.id, message.author.username).then((user) => {
                // Determine which handler to call.
                switch (cmd) {
                    case Commands_1.Commands.BANK:
                        return this.partyFundCommandHandler.handleUserCommand(command, message, user).then((msg) => {
                            message.delete({ reason: "Bank command deletion." });
                            return msg;
                        });
                    case Commands_1.Commands.CALENDAR:
                        return this.calendarCommandHandler.handleUserCommand(command, message, user);
                    case Commands_1.Commands.CHARACTER:
                        return this.characterCommandHandler.handleUserCommand(command, message, user);
                    case Commands_1.Commands.DATE:
                        return this.dateCommandHandler.handleUserCommand(command, message, user);
                    case Commands_1.Commands.FUND:
                        return this.partyFundCommandHandler.handleUserCommand(command, message, user).then((msg) => {
                            message.delete({ reason: "Fund command deletion." });
                            return msg;
                        });
                    case Commands_1.Commands.PARTY:
                        return this.partyCommandHandler.handleUserCommand(command, message, user);
                    case Commands_1.Commands.REGISTER:
                        return this.registerUserCommandHandler.handleUserCommand(command, message, user);
                    case Commands_1.Commands.SENDING:
                        return this.sendingCommandHandler.handleUserCommand(command, message, user);
                    case Commands_1.Commands.WHICH:
                        return this.whichCommandHandler.handleUserCommand(command, message, user).then((msg) => {
                            message.delete({ reason: "Which command deletion." });
                            return msg;
                        });
                    case Commands_1.Commands.WORLD:
                        return this.worldCommandHandler.handleUserCommand(command, message, user);
                }
            });
        });
    }
};
MessageResponder = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.CalendarCommandHandler)),
    __param(1, inversify_1.inject(types_1.TYPES.CharacterCommandHandler)),
    __param(2, inversify_1.inject(types_1.TYPES.DateCommandHandler)),
    __param(3, inversify_1.inject(types_1.TYPES.HelpCommandHandler)),
    __param(4, inversify_1.inject(types_1.TYPES.PartyFundCommandHandler)),
    __param(5, inversify_1.inject(types_1.TYPES.PartyCommandHandler)),
    __param(6, inversify_1.inject(types_1.TYPES.QuoteCommandHandler)),
    __param(7, inversify_1.inject(types_1.TYPES.RegisterUserCommandHandler)),
    __param(8, inversify_1.inject(types_1.TYPES.SendingCommandHandler)),
    __param(9, inversify_1.inject(types_1.TYPES.WhichCommandHandler)),
    __param(10, inversify_1.inject(types_1.TYPES.WorldCommandHandler)),
    __param(11, inversify_1.inject(types_1.TYPES.UserController)),
    __metadata("design:paramtypes", [CalendarCommandHandler_1.CalendarCommandHandler,
        CharacterCommandHandler_1.CharacterCommandHandler,
        DateCommandHandler_1.DateCommandHandler,
        HelpCommandHandler_1.HelpCommandHandler,
        PartyFundCommandHandler_1.PartyFundCommandHandler,
        PartyCommandHandler_1.PartyCommandHandler,
        QuoteCommandHandler_1.QuoteCommandHandler,
        RegisterCommandHandler_1.RegisterCommandHandler,
        SendingCommandHandler_1.SendingCommandHandler,
        WhichCommandHandler_1.WhichCommandHandler,
        WorldCommandHandler_1.WorldCommandHandler,
        UserController_1.UserController])
], MessageResponder);
exports.MessageResponder = MessageResponder;
//# sourceMappingURL=message-responder.js.map