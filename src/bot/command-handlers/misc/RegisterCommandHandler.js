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
exports.RegisterCommandHandler = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../types");
const UserDefaultPartyService_1 = require("../../../backend/database/UserDefaultPartyService");
const UserToGuildService_1 = require("../../../backend/database/UserToGuildService");
const PartyController_1 = require("../../../backend/controllers/party/PartyController");
const Subcommands_1 = require("../../../shared/documentation/commands/Subcommands");
const WorldController_1 = require("../../../backend/controllers/world/WorldController");
const AbstractUserCommandHandler_1 = require("../base/AbstractUserCommandHandler");
const UserController_1 = require("../../../backend/controllers/user/UserController");
/**
 * Command to register a user as having access to the funds created on a specific server.
 */
let RegisterCommandHandler = class RegisterCommandHandler extends AbstractUserCommandHandler_1.AbstractUserCommandHandler {
    constructor(partyController, userDefaultPartyService, userController, userToGuildService, worldController) {
        super();
        this.partyController = partyController;
        this.userDefaultPartyService = userDefaultPartyService;
        this.userController = userController;
        this.userToGuildService = userToGuildService;
        this.worldController = worldController;
    }
    handleUserCommand(command, message, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Subcommands_1.Subcommands.PARTY.isCommand(command)) {
                const createParty = Subcommands_1.Subcommands.PARTY.getCommand(command);
                return this.partyController.create(createParty.getInput(), message.guild.id, message.author.id)
                    .then((party) => {
                    return message.channel.send("Created new party: " + party.name);
                });
            }
            return this.registerUserToGuild(command, message).then((res) => {
                if (!res) {
                    return message.channel.send("Could not register user.");
                }
                return message.channel.send("You now have access to all funds registered to this server!");
            });
        });
    }
    /**
     * Registers a user to a guild.
     *
     * @param command The processed command.
     * @param message The message used for this message.
     */
    registerUserToGuild(command, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = message.author;
            const guild = message.guild.id;
            // First get the user.
            return this.userController.get(user.id, user.username).then((res) => {
                if (res == null) {
                    return false;
                }
                return this.userToGuildService.registerUserOnGuild(guild, user.id).then((map) => {
                    return map != null;
                });
            });
        });
    }
};
RegisterCommandHandler = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.PartyController)),
    __param(1, inversify_1.inject(types_1.TYPES.UserDefaultPartyService)),
    __param(2, inversify_1.inject(types_1.TYPES.UserController)),
    __param(3, inversify_1.inject(types_1.TYPES.UserToGuildService)),
    __param(4, inversify_1.inject(types_1.TYPES.WorldController)),
    __metadata("design:paramtypes", [PartyController_1.PartyController,
        UserDefaultPartyService_1.UserDefaultPartyService,
        UserController_1.UserController,
        UserToGuildService_1.UserToGuildService,
        WorldController_1.WorldController])
], RegisterCommandHandler);
exports.RegisterCommandHandler = RegisterCommandHandler;
//# sourceMappingURL=RegisterCommandHandler.js.map