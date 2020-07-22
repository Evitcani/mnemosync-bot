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
exports.SendingCommandHandler = void 0;
const AbstractUserCommandHandler_1 = require("./base/AbstractUserCommandHandler");
const inversify_1 = require("inversify");
const types_1 = require("../types");
const EncryptionUtility_1 = require("../utilities/EncryptionUtility");
const Subcommands_1 = require("../documentation/commands/Subcommands");
const Sending_1 = require("../entity/Sending");
const NPCController_1 = require("../controllers/NPCController");
const SendingController_1 = require("../controllers/SendingController");
let SendingCommandHandler = class SendingCommandHandler extends AbstractUserCommandHandler_1.AbstractUserCommandHandler {
    constructor(encryptionUtility, npcController, sendingController) {
        super();
        this.encryptionUtility = encryptionUtility;
        this.npcController = npcController;
        this.sendingController = sendingController;
    }
    handleUserCommand(command, message, user) {
        return __awaiter(this, void 0, void 0, function* () {
            // Want to view sendings.
            if (command.getSubcommands() == null || command.getSubcommands().size < 1) {
            }
            // Sending a message to another player!
            const readCmd = Subcommands_1.Subcommands.READ.isCommand(command);
            if (readCmd != null) {
                // Get latest message.
                if (readCmd.getInput() == null) {
                }
                // TODO: Figure out how this'll work...
                return null;
            }
            // Replying to a sending.
            const replyCmd = Subcommands_1.Subcommands.REPLY.isCommand(command);
            if (replyCmd != null) {
                // TODO: Will deal with later...
                return null;
            }
            return this.getWorld(user).then((world) => {
                if (world == null) {
                    return message.channel.send("No world where this message can be sent!");
                }
                return this.constructNewSending(command, user, world, new Sending_1.Sending(), message).then((sending) => {
                    if (sending == null) {
                        return message.channel.send("Could not send message.");
                    }
                    return this.sendingController.create(sending).then((sent) => {
                        return message.channel.send(`Sent message to ` +
                            `${sent.toNpc == null ? sent.toPlayer.name : sent.toNpc.name} with message ` +
                            `${this.encryptionUtility.decrypt(sent.content)}`);
                    });
                });
            });
        });
    }
    getWorld(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user.defaultCharacter == null) {
                if (user.defaultWorld == null) {
                    return null;
                }
                return user.defaultWorld;
            }
            if (user.defaultCharacter.party == null) {
                return null;
            }
            if (user.defaultCharacter.party.world == null) {
                return null;
            }
            return user.defaultCharacter.party.world;
        });
    }
    constructNewSending(command, user, world, sending, message) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get the content.
            const msgCmd = Subcommands_1.Subcommands.MESSAGE.isCommand(command);
            const replyCmd = Subcommands_1.Subcommands.REPLY.isCommand(command);
            if (msgCmd != null) {
                if (replyCmd == null) {
                    sending.content = this.encryptionUtility.encrypt(msgCmd.getInput());
                }
                else {
                    sending.reply = this.encryptionUtility.encrypt(msgCmd.getInput());
                    return sending;
                }
            }
            else {
                yield message.channel.send("Message has no content. Add message content with `~msg [content]`.");
                return null;
            }
            // Get the in-game date.
            const dateCmd = Subcommands_1.Subcommands.DATE.isCommand(command);
            if (dateCmd != null) {
                sending.inGameDate = dateCmd.getInput();
            }
            else {
                yield message.channel.send("Message has no date. Add message (in-game) date with `~date [day]/[month]/[year]`.");
                return null;
            }
            // If going to an NPC, need to see which one.
            const tonCmd = Subcommands_1.Subcommands.TO_NPC.isCommand(command);
            if (tonCmd != null) {
                sending.toNpc = yield this.npcController.getByName(tonCmd.getInput(), world.id);
            }
            else {
                const toCmd = Subcommands_1.Subcommands.TO.isCommand(command);
                if (toCmd != null) {
                    // TODO: Allow players to send messages to other players.
                    return null;
                }
                else {
                    return null;
                }
            }
            // Get who the message is from.
            const fromCmd = Subcommands_1.Subcommands.FROM.isCommand(command);
            if (fromCmd != null) {
                sending.fromNpc = yield this.npcController.getByName(fromCmd.getInput(), world.id);
            }
            else {
                if (user.defaultCharacter != null) {
                    sending.fromPlayer = user.defaultCharacter;
                }
                else {
                    // From no one...
                    return null;
                }
            }
            return sending;
        });
    }
};
SendingCommandHandler = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.EncryptionUtility)),
    __param(1, inversify_1.inject(types_1.TYPES.NPCController)),
    __param(2, inversify_1.inject(types_1.TYPES.SendingController)),
    __metadata("design:paramtypes", [EncryptionUtility_1.EncryptionUtility,
        NPCController_1.NPCController,
        SendingController_1.SendingController])
], SendingCommandHandler);
exports.SendingCommandHandler = SendingCommandHandler;
//# sourceMappingURL=SendingCommandHandler.js.map