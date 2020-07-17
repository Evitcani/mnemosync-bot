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
exports.RegisterUserCommandHandler = void 0;
const AbstractCommandHandler_1 = require("./base/AbstractCommandHandler");
const inversify_1 = require("inversify");
const types_1 = require("../types");
const UserDefaultPartyService_1 = require("../database/UserDefaultPartyService");
/**
 * Command to register a user as having access to the funds created on a specific server.
 */
let RegisterUserCommandHandler = class RegisterUserCommandHandler extends AbstractCommandHandler_1.AbstractCommandHandler {
    constructor(userDefaultPartyService) {
        super();
        this.userDefaultPartyService = userDefaultPartyService;
    }
    handleCommand(command, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = message.author;
            const guild = message.guild.id;
            // First check that the user already exists.
            return this.userDefaultPartyService.getDefaultParty(guild, user.id).then((res) => {
                console.log("Number is: " + res);
                return message.channel.send("Found result for user!");
            });
        });
    }
};
RegisterUserCommandHandler = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.UserDefaultPartyService)),
    __metadata("design:paramtypes", [UserDefaultPartyService_1.UserDefaultPartyService])
], RegisterUserCommandHandler);
exports.RegisterUserCommandHandler = RegisterUserCommandHandler;
//# sourceMappingURL=RegisterUserCommandHandler.js.map