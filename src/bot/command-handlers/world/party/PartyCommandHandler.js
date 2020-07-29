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
exports.PartyCommandHandler = void 0;
const AbstractUserCommandHandler_1 = require("../../base/AbstractUserCommandHandler");
const inversify_1 = require("inversify");
const Subcommands_1 = require("../../../../shared/documentation/commands/Subcommands");
const types_1 = require("../../../../types");
const PartyController_1 = require("../../../../backend/controllers/party/PartyController");
const UserController_1 = require("../../../../backend/controllers/user/UserController");
let PartyCommandHandler = class PartyCommandHandler extends AbstractUserCommandHandler_1.AbstractUserCommandHandler {
    constructor(partyController, userController) {
        super();
        this.partyController = partyController;
        this.userController = userController;
    }
    handleUserCommand(command, message, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Subcommands_1.Subcommands.SWITCH.isCommand(command)) {
                return this.handleSwitchCommand(command, message, user);
            }
            return undefined;
        });
    }
    handleSwitchCommand(command, message, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let ptCmd = Subcommands_1.Subcommands.SWITCH.getCommand(command);
            if (ptCmd.getInput() == null) {
                user.defaultParty = null;
                yield this.userController.save(user);
                return message.channel.send("Removed default party.");
            }
            let parties = yield this.partyController.getByNameAndGuild(ptCmd.getInput(), message.guild.id);
            if (parties.length <= 0) {
                return message.channel.send("Could not find party with that name.");
            }
            let party;
            if (parties.length == 1) {
                party = parties[0];
            }
            else {
                party = yield this.partyController.partySelection(parties, "switch to", message);
            }
            if (party == null) {
                return null;
            }
            user.defaultParty = party;
            yield this.userController.save(user);
            return message.channel.send("Switched default party to: " + party.name);
        });
    }
};
PartyCommandHandler = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.PartyController)),
    __param(1, inversify_1.inject(types_1.TYPES.UserController)),
    __metadata("design:paramtypes", [PartyController_1.PartyController,
        UserController_1.UserController])
], PartyCommandHandler);
exports.PartyCommandHandler = PartyCommandHandler;
//# sourceMappingURL=PartyCommandHandler.js.map