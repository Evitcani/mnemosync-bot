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
const AbstractCommandHandler_1 = require("./base/AbstractCommandHandler");
const inversify_1 = require("inversify");
const types_1 = require("../types");
const UserDefaultPartyService_1 = require("../database/UserDefaultPartyService");
const UserService_1 = require("../database/UserService");
const UserToGuildService_1 = require("../database/UserToGuildService");
/**
 * Command to register a user as having access to the funds created on a specific server.
 */
let RegisterCommandHandler = class RegisterCommandHandler extends AbstractCommandHandler_1.AbstractCommandHandler {
    constructor(userDefaultPartyService, userService, userToGuildService) {
        super();
        this.userDefaultPartyService = userDefaultPartyService;
        this.userService = userService;
        this.userToGuildService = userToGuildService;
    }
    handleCommand(command, message) {
        return __awaiter(this, void 0, void 0, function* () {
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
            return this.userService.getUser(user.id, user.username).then(() => {
                return this.userToGuildService.registerUserOnGuild(guild, user.id);
            });
        });
    }
};
RegisterCommandHandler = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.UserDefaultPartyService)),
    __param(1, inversify_1.inject(types_1.TYPES.UserService)),
    __param(2, inversify_1.inject(types_1.TYPES.UserToGuildService)),
    __metadata("design:paramtypes", [UserDefaultPartyService_1.UserDefaultPartyService,
        UserService_1.UserService,
        UserToGuildService_1.UserToGuildService])
], RegisterCommandHandler);
exports.RegisterCommandHandler = RegisterCommandHandler;
//# sourceMappingURL=RegisterCommandHandler.js.map