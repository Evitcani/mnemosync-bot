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
var SendingCommandHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendingCommandHandler = void 0;
const AbstractUserCommandHandler_1 = require("../../../base/AbstractUserCommandHandler");
const inversify_1 = require("inversify");
const discord_js_1 = require("discord.js");
const types_1 = require("../../../../types");
const EncryptionUtility_1 = require("../../../../utilities/EncryptionUtility");
const Subcommands_1 = require("../../../../documentation/commands/Subcommands");
const Sending_1 = require("../../../../entity/Sending");
const NPCController_1 = require("../../../../controllers/character/NPCController");
const SendingController_1 = require("../../../../controllers/character/SendingController");
const SendingHelpRelatedResponses_1 = require("../../../../documentation/client-responses/misc/SendingHelpRelatedResponses");
const WorldController_1 = require("../../../../controllers/world/WorldController");
const GameDate_1 = require("../../../../entity/GameDate");
const CharacterController_1 = require("../../../../controllers/character/CharacterController");
let SendingCommandHandler = SendingCommandHandler_1 = class SendingCommandHandler extends AbstractUserCommandHandler_1.AbstractUserCommandHandler {
    constructor(characterController, encryptionUtility, npcController, sendingController, worldController) {
        super();
        this.characterController = characterController;
        this.encryptionUtility = encryptionUtility;
        this.npcController = npcController;
        this.sendingController = sendingController;
        this.worldController = worldController;
    }
    handleUserCommand(command, message, user) {
        return __awaiter(this, void 0, void 0, function* () {
            // Want to view sendings.
            if (command.getSubcommands() == null || command.getSubcommands().size < 1 || Subcommands_1.Subcommands.GET.isCommand(command)) {
                console.log("Getting unreplied sendings...");
                return this.getUnrepliedSendings(command, user, message);
            }
            console.log("Not looking for unreplied sendings!");
            // Reading a message.
            if (Subcommands_1.Subcommands.READ.isCommand(command)) {
                const readCmd = Subcommands_1.Subcommands.READ.getCommand(command);
                // Get latest message.
                if (readCmd.getInput() == null) {
                }
                // TODO: Figure out how this'll work...
                console.log("Deal with reads later...");
                return null;
            }
            console.log("Not reading!");
            if (Subcommands_1.Subcommands.REPLY.isCommand(command)) {
                // Someone is replying!
                return this.beginReply(command, user, message);
            }
            console.log("Not replying! Going to send a new message...");
            return this.worldController.worldSelectionFromUser(user, message).then((world) => {
                if (world == null) {
                    return message.channel.send("No world where this message can be sent!");
                }
                console.log("Constructing a new sending..");
                return this.constructNewSending(command, user, world, new Sending_1.Sending(), message).then((sending) => {
                    if (sending == null) {
                        return message.channel.send("Could not send message.");
                    }
                    console.log("Created sending, now saving...");
                    return this.sendingController.create(sending).then((sent) => {
                        if (sent == null) {
                            return message.channel.send("Could not send message.");
                        }
                        console.log("Saved, returning...");
                        return message.channel.send(`Sent message to ` +
                            `${sent.toNpc == null ? sent.toPlayer.name : sent.toNpc.name} with message ` +
                            `${this.encryptionUtility.decrypt(sent.content)}`);
                    });
                });
            });
        });
    }
    beginReply(command, user, message) {
        return __awaiter(this, void 0, void 0, function* () {
            let replyCmd = Subcommands_1.Subcommands.REPLY.getCommand(command);
            if (replyCmd.getInput() == null) {
                return message.channel.send("No reply ID.");
            }
            let page = SendingCommandHandler_1.getNumber(replyCmd.getInput());
            if (page == null) {
                return message.channel.send("ID isn't a number.");
            }
            if (user.defaultCharacter != null && user.defaultWorld != null) {
                return this.worldOrCharacter(user.defaultWorld, user.defaultCharacter, message).then((ret) => {
                    if (ret == null) {
                        return null;
                    }
                    // Type is world.
                    if (WorldController_1.WorldController.isWorld(ret)) {
                        return this.sendingController.getOne(page, ret, null, null).then((msg) => {
                            return this.doReply(msg, command, user, message);
                        });
                    }
                    return this.sendingController.getOne(page, null, null, ret).then((msg) => {
                        return this.doReply(msg, command, user, message);
                    });
                });
            }
            if (user.defaultCharacter != null) {
                return this.sendingController.getOne(page, null, null, user.defaultCharacter).then((msg) => {
                    return this.doReply(msg, command, user, message);
                });
            }
            if (user.defaultWorld != null) {
                return this.sendingController.getOne(page, user.defaultWorld, null, null).then((msg) => {
                    return this.doReply(msg, command, user, message);
                });
            }
            return message.channel.send(SendingHelpRelatedResponses_1.SendingHelpRelatedResponses.NO_DEFAULT_WORLD_OR_CHARACTER());
        });
    }
    doReply(msg, command, user, message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (msg == null) {
                return message.channel.send("Could not find message with that ID.");
            }
            return this.constructNewSending(command, user, null, msg, message).then((sending) => {
                if (sending == null) {
                    return null;
                }
                return this.sendingController.create(sending).then((sending) => {
                    // Notify the player of the reply.
                    if (sending.fromPlayerId != null) {
                        return this.characterController.getDiscordId(sending.fromPlayerId).then((discordIds) => __awaiter(this, void 0, void 0, function* () {
                            if (discordIds == null || discordIds.length < 1) {
                                return message.channel.send("No discord accounts associated with this message!");
                            }
                            console.log("Got to flipping through user stuff..");
                            let discordId, i;
                            for (i = 0; i < discordIds.length; i++) {
                                discordId = discordIds[i];
                                console.log("Trying to find user of id " + discordId);
                                if (message.client.users.cache == null || !message.client.users.cache.has(discordId)) {
                                    console.log("No discord user of that ID is cached. Fetching...");
                                    yield message.client.users.fetch(discordId).then((member) => __awaiter(this, void 0, void 0, function* () {
                                        console.log("Finished fetching!");
                                        // No member found, so can't send message.
                                        if (!member) {
                                            console.log("Nothing found.");
                                            return;
                                        }
                                        // Set the cache.
                                        if (message.client.users.cache == null) {
                                            console.log("Creating a new cache.");
                                            message.client.users.cache = new discord_js_1.Collection();
                                        }
                                        console.log("Caching user...");
                                        message.client.users.cache.set(member.id, member);
                                        // Do response.
                                        console.log("Sending response...");
                                        return SendingCommandHandler_1.doDM(member, SendingHelpRelatedResponses_1.SendingHelpRelatedResponses.PRINT_MESSAGE_REPLY_TO_PLAYER(sending, this.encryptionUtility));
                                    }));
                                }
                                else {
                                    let member = message.client.users.cache.get(discordId);
                                    yield SendingCommandHandler_1.doDM(member, SendingHelpRelatedResponses_1.SendingHelpRelatedResponses.PRINT_MESSAGE_REPLY_TO_PLAYER(sending, this.encryptionUtility));
                                }
                            }
                            return message.channel.send("Finished informing all users of the reply.");
                        }));
                    }
                    // TODO: From an NPC.
                    return null;
                });
            });
        });
    }
    static doDM(member, message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (member == null) {
                return null;
            }
            console.log("Got to fetching a user.");
            return member.fetch().then((freshUser) => {
                console.log("Got to sending a user.");
                return freshUser.send(message);
            }).catch((err) => {
                console.error("ERR ::: Could not DM user.");
                console.error(err);
                return null;
            });
        });
    }
    getUnrepliedSendings(command, user, message) {
        return __awaiter(this, void 0, void 0, function* () {
            // Process the next  command.
            let page = 0;
            if (Subcommands_1.Subcommands.NEXT.isCommand(command)) {
                const nextCmd = Subcommands_1.Subcommands.NEXT.getCommand(command);
                if (nextCmd.getInput() != null) {
                    let pg = Number(nextCmd.getInput());
                    if (!isNaN(pg)) {
                        page = pg;
                    }
                }
                else {
                    page = 1;
                }
            }
            if (user.defaultCharacter != null && user.defaultWorld != null) {
                return this.worldOrCharacter(user.defaultWorld, user.defaultCharacter, message).then((ret) => {
                    if (ret == null) {
                        return null;
                    }
                    // Type is world.
                    if (WorldController_1.WorldController.isWorld(ret)) {
                        return this.getUnrepliedSendingsForWorld(page, ret, message);
                    }
                    return this.getUnrepliedSendingsForCharacter(page, ret, message);
                });
            }
            if (user.defaultCharacter != null) {
                return this.getUnrepliedSendingsForCharacter(page, user.defaultCharacter, message);
            }
            if (user.defaultWorld != null) {
                return this.getUnrepliedSendingsForWorld(page, user.defaultWorld, message);
            }
            return message.channel.send(SendingHelpRelatedResponses_1.SendingHelpRelatedResponses.NO_DEFAULT_WORLD_OR_CHARACTER());
        });
    }
    getUnrepliedSendingsForWorld(page, world, message) {
        return __awaiter(this, void 0, void 0, function* () {
            // Go out to fetch the messages.
            return this.sendingController.get(page, world, null, null).then((messages) => {
                return message.channel.send(SendingHelpRelatedResponses_1.SendingHelpRelatedResponses.PRINT_MESSAGES_FROM_WORLD(messages, world, page, this.encryptionUtility));
            });
        });
    }
    getUnrepliedSendingsForCharacter(page, character, message) {
        return __awaiter(this, void 0, void 0, function* () {
            // Go out to fetch the messages.
            return this.sendingController.get(page, null, null, character).then((messages) => {
                return message.channel.send(SendingHelpRelatedResponses_1.SendingHelpRelatedResponses.PRINT_MESSAGES_TO_CHARACTER(messages, character, page, this.encryptionUtility));
            });
        });
    }
    constructNewSending(command, user, world, sending, message) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get the content.
            if (Subcommands_1.Subcommands.MESSAGE.isCommand(command)) {
                const msgCmd = Subcommands_1.Subcommands.MESSAGE.getCommand(command);
                if (!Subcommands_1.Subcommands.REPLY.isCommand(command)) {
                    sending.content = this.encryptionUtility.encrypt(msgCmd.getInput());
                }
                else {
                    sending.reply = this.encryptionUtility.encrypt(msgCmd.getInput());
                    return sending;
                }
            }
            else {
                yield message.channel.send(SendingHelpRelatedResponses_1.SendingHelpRelatedResponses.MESSAGE_HAS_NO_CONTENT(message.content));
                return null;
            }
            // Set the world.
            sending.world = world;
            // Get the in-game date.
            if (Subcommands_1.Subcommands.DATE.isCommand(command)) {
                const dateCmd = Subcommands_1.Subcommands.DATE.getCommand(command);
                let input = dateCmd.getInput();
                if (input == null) {
                    yield message.channel.send("There was no actual date given.");
                    return null;
                }
                // Split the date and process.
                let dates = input.split("/");
                if (dates.length < 3) {
                    yield message.channel.send("Date was malformed. Should be like `[day]/[month]/[year]`");
                    return null;
                }
                // TODO: Implement era processing.
                let day = SendingCommandHandler_1.getNumber(dates[0]), month = SendingCommandHandler_1.getNumber(dates[1]), year = SendingCommandHandler_1.getNumber(dates[2]);
                // TODO: Better response here.
                if (day == null || month == null || year == null) {
                    yield message.channel.send("Date was malformed. Day, month or year was not a number. Should be like " +
                        "`[# day]/[# month]/[# year]`");
                    return null;
                }
                // Now put it inside the sending.
                sending.inGameDate = new GameDate_1.GameDate();
                sending.inGameDate.day = day;
                sending.inGameDate.month = month;
                sending.inGameDate.year = year;
            }
            else {
                yield message.channel.send(SendingHelpRelatedResponses_1.SendingHelpRelatedResponses.MESSAGE_HAS_NO_DATE(message.content));
                return null;
            }
            // If going to an NPC, need to see which one.
            if (Subcommands_1.Subcommands.TO_NPC.isCommand(command)) {
                const tonCmd = Subcommands_1.Subcommands.TO_NPC.getCommand(command);
                sending.toNpc = yield this.npcController.getByName(tonCmd.getInput(), world.id);
                // Could not find the NPC.
                if (sending.toNpc == null) {
                    yield message.channel.send("Could not find the given NPC you were trying to send to.");
                    return null;
                }
            }
            else {
                if (Subcommands_1.Subcommands.TO.isCommand(command)) {
                    // TODO: Allow players to send messages to other players.
                    yield message.channel.send("Not yet supporting player-to-player messages!");
                    return null;
                }
                else {
                    return null;
                }
            }
            // Get who the message is from.
            if (Subcommands_1.Subcommands.FROM.isCommand(command)) {
                const fromCmd = Subcommands_1.Subcommands.FROM.getCommand(command);
                sending.fromNpc = yield this.npcController.getByName(fromCmd.getInput(), world.id);
            }
            else {
                if (user.defaultCharacter != null) {
                    sending.fromPlayer = user.defaultCharacter;
                }
                else {
                    // From no one...
                    yield message.channel.send("Couldn't figure out who this message was meant to be from!");
                    return null;
                }
            }
            return sending;
        });
    }
    worldOrCharacter(world, character, message) {
        return __awaiter(this, void 0, void 0, function* () {
            return message.channel.send(SendingHelpRelatedResponses_1.SendingHelpRelatedResponses.CHECK_SENDINGS_FOR_WHICH(character, world)).then((msg) => {
                return message.channel.awaitMessages(m => m.author.id === message.author.id, {
                    max: 1,
                    time: 10e3,
                    errors: ['time'],
                }).then((input) => {
                    msg.delete({ reason: "Removed processing command." });
                    let content = input.first().content;
                    let choice = Number(content);
                    if (isNaN(choice) || choice > 2 || choice < 1) {
                        message.channel.send("Input doesn't make sense!");
                        return null;
                    }
                    input.first().delete();
                    return choice == 1 ? world : character;
                }).catch(() => {
                    msg.delete({ reason: "Removed processing command." });
                    message.channel.send("Message timed out.");
                    return null;
                });
            });
        });
    }
    static getNumber(input) {
        if (input == null) {
            return null;
        }
        let ret = Number(input);
        if (isNaN(ret)) {
            return null;
        }
        return ret;
    }
};
SendingCommandHandler = SendingCommandHandler_1 = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.CharacterController)),
    __param(1, inversify_1.inject(types_1.TYPES.EncryptionUtility)),
    __param(2, inversify_1.inject(types_1.TYPES.NPCController)),
    __param(3, inversify_1.inject(types_1.TYPES.SendingController)),
    __param(4, inversify_1.inject(types_1.TYPES.WorldController)),
    __metadata("design:paramtypes", [CharacterController_1.CharacterController,
        EncryptionUtility_1.EncryptionUtility,
        NPCController_1.NPCController,
        SendingController_1.SendingController,
        WorldController_1.WorldController])
], SendingCommandHandler);
exports.SendingCommandHandler = SendingCommandHandler;
//# sourceMappingURL=SendingCommandHandler.js.map