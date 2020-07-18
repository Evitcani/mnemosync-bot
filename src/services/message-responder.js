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
const PartyFundCommandHandler_1 = require("../command-handlers/PartyFundCommandHandler");
const RegisterCommandHandler_1 = require("../command-handlers/RegisterCommandHandler");
const WhichCommandHandler_1 = require("../command-handlers/WhichCommandHandler");
const HelpCommandHandler_1 = require("../command-handlers/HelpCommandHandler");
const QuoteCommandHandler_1 = require("../command-handlers/QuoteCommandHandler");
const Commands_1 = require("../documentation/commands/Commands");
let MessageResponder = class MessageResponder {
    constructor(helpCommandHandler, partyFundCommandHandler, quoteCommandHandler, registerUserCommandHandler, whichCommandHandler) {
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
    handle(command, message) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get the base command.
            const cmd = command.getName();
            console.log("Command: " + cmd);
            // Determine which handler to call.
            switch (cmd) {
                case Commands_1.Commands.BANK:
                    return this.partyFundCommandHandler.handleCommand(command, message);
                case Commands_1.Commands.FUND:
                    return this.partyFundCommandHandler.handleCommand(command, message);
                case Commands_1.Commands.HELP:
                    return this.helpCommandHandler.handleCommand(command, message);
                case Commands_1.Commands.QUOTE:
                    return this.quoteCommandHandler.handleCommand(command, message);
                case Commands_1.Commands.REGISTER:
                    return this.registerUserCommandHandler.handleCommand(command, message);
                case Commands_1.Commands.WHICH:
                    return this.whichCommandHandler.handleCommand(command, message);
            }
        });
    }
};
MessageResponder = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.HelpCommandHandler)),
    __param(1, inversify_1.inject(types_1.TYPES.PartyFundCommandHandler)),
    __param(2, inversify_1.inject(types_1.TYPES.QuoteCommandHandler)),
    __param(3, inversify_1.inject(types_1.TYPES.RegisterUserCommandHandler)),
    __param(4, inversify_1.inject(types_1.TYPES.WhichCommandHandler)),
    __metadata("design:paramtypes", [HelpCommandHandler_1.HelpCommandHandler,
        PartyFundCommandHandler_1.PartyFundCommandHandler,
        QuoteCommandHandler_1.QuoteCommandHandler,
        RegisterCommandHandler_1.RegisterCommandHandler,
        WhichCommandHandler_1.WhichCommandHandler])
], MessageResponder);
exports.MessageResponder = MessageResponder;
//# sourceMappingURL=message-responder.js.map