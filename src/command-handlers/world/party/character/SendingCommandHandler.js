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
const AbstractUserCommandHandler_1 = require("../../../base/AbstractUserCommandHandler");
const inversify_1 = require("inversify");
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
const MessageUtility_1 = require("../../../../utilities/MessageUtility");
const StringUtility_1 = require("../../../../utilities/StringUtility");
const PartyController_1 = require("../../../../controllers/party/PartyController");
/**
 * Handles sending related commands.
 */
let SendingCommandHandler = class SendingCommandHandler extends AbstractUserCommandHandler_1.AbstractUserCommandHandler {
    constructor(characterController, encryptionUtility, partyController, npcController, sendingController, worldController) {
        super();
        this.characterController = characterController;
        this.encryptionUtility = encryptionUtility;
        this.partyController = partyController;
        this.npcController = npcController;
        this.sendingController = sendingController;
        this.worldController = worldController;
    }
    handleUserCommand(command, message, user) {
        return __awaiter(this, void 0, void 0, function* () {
            // Want to view sendings.
            if (command.getSubcommands() == null || command.getSubcommands().size < 1 || Subcommands_1.Subcommands.GET.isCommand(command)) {
                return this.getUnrepliedSendings(command, user, message);
            }
            // Reading a message.
            if (Subcommands_1.Subcommands.READ.isCommand(command)) {
                const readCmd = Subcommands_1.Subcommands.READ.getCommand(command);
                // Get latest message.
                if (readCmd.getInput() == null) {
                }
                // TODO: Figure out how this'll work...
                return null;
            }
            if (Subcommands_1.Subcommands.REPLY.isCommand(command)) {
                // Someone is replying!
                return this.replyToSending(command, user, message);
            }
            return this.createNewSending(command, message, user);
        });
    }
    /**
     * Creates a new sending from the information given by the command.
     *
     * @param command The command originally sent.
     * @param message Message object of the originating command.
     * @param user The user doing the command.
     */
    createNewSending(command, message, user) {
        return __awaiter(this, void 0, void 0, function* () {
            // Go and get the world.
            let world = yield this.worldController.worldSelectionFromUser(user, message);
            // If there is no world, then give an automated reply.
            if (world == null) {
                return message.channel.send("No world where this message can be sent!");
            }
            // Construct the sending.
            let sending = yield this.constructNewSending(command, user, world, new Sending_1.Sending(), message);
            // Some sort of failure happened.
            if (sending == null) {
                return message.channel.send("Could not send message.");
            }
            // Put the sending in the database.
            const sent = yield this.sendingController.create(sending);
            // If could not send, respond in kind.
            if (sent == null) {
                return message.channel.send("Could not send message.");
            }
            // Create embed and notify users.
            let toSend = SendingHelpRelatedResponses_1.SendingHelpRelatedResponses.PRINT_MESSAGE_TO_PLAYER(sending, this.encryptionUtility);
            let onComplete = SendingHelpRelatedResponses_1.SendingHelpRelatedResponses.PRINT_FINISHED_INFORMING(sending, this.encryptionUtility);
            return this.signalUserOfMessage(sent, message, onComplete, toSend, false);
        });
    }
    /**
     * Handles the process of replying to a sending.
     *
     * @param command The command originally sent.
     * @param message Message object of the originating command.
     * @param user The user doing the command.
     */
    replyToSending(command, user, message) {
        return __awaiter(this, void 0, void 0, function* () {
            let replyCmd = Subcommands_1.Subcommands.REPLY.getCommand(command);
            if (replyCmd.getInput() == null) {
                return message.channel.send("No reply ID.");
            }
            let page = StringUtility_1.StringUtility.getNumber(replyCmd.getInput());
            if (page == null) {
                return message.channel.send("ID isn't a number.");
            }
            let arr = yield this.getSendingArray(user.defaultWorld, user.defaultCharacter, null, message);
            // If both are null, return a standard message.
            if (arr.world == null && arr.character == null) {
                return message.channel.send(SendingHelpRelatedResponses_1.SendingHelpRelatedResponses.NO_DEFAULT_WORLD_OR_CHARACTER());
            }
            let msg = yield this.sendingController.getOne(page, arr.world, arr.npc, arr.character);
            // If no message, couldn't find it.
            if (msg == null) {
                return message.channel.send("Could not find message with that ID.");
            }
            // Now get the sending to put in the message.
            let sending = yield this.constructNewSending(command, user, null, msg, message);
            // IF null, something went wrong upstream.
            if (sending == null) {
                return null;
            }
            // Get the sending from creating a new one.
            sending = yield this.sendingController.create(sending);
            // Now craft the embed and send to users.
            let toSend = SendingHelpRelatedResponses_1.SendingHelpRelatedResponses.PRINT_MESSAGE_REPLY_TO_PLAYER(sending, this.encryptionUtility);
            let onComplete = SendingHelpRelatedResponses_1.SendingHelpRelatedResponses.PRINT_FINISHED_INFORMING(sending, this.encryptionUtility);
            return this.signalUserOfMessage(sending, message, onComplete, toSend, true);
        });
    }
    /**
     * Gets who the message should be retrieved for.
     * @param world
     * @param character
     * @param npc
     * @param message
     */
    getSendingArray(world, character, npc, message) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Implement for NPC.
            // If both are not null, give user a choice.
            if (world != null && character != null) {
                let ret = yield this.worldOrCharacter(world, character, message);
                if (ret == null) {
                    return null;
                }
                // Type is world.
                if (WorldController_1.WorldController.isWorld(ret)) {
                    world = ret;
                    character = null;
                }
                else {
                    character = ret;
                    world = null;
                }
            }
            return { world: world, character: character, npc: npc };
        });
    }
    /**
     * Signals users of the changes made.
     *
     * @param sending
     * @param message
     * @param completionMessage
     * @param messageToSend
     * @param to
     */
    signalUserOfMessage(sending, message, completionMessage, messageToSend, to) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get discord ids of users to send messages to.
            let discordIds = null;
            // Are we getting from a player character?
            let playerCharacter = (sending.fromPlayerId != null && to) ?
                sending.fromPlayerId :
                ((sending.toPlayerId != null && !to) ? sending.toPlayerId : null);
            // Are we getting from an NPC?
            let npc = (sending.fromNpc != null && to) ?
                sending.fromNpc :
                ((sending.toNpc != null && !to) ? sending.toNpc : null);
            // Notify the player of the reply.
            if (playerCharacter != null) {
                discordIds = yield this.characterController.getDiscordId(playerCharacter);
            }
            // From an NPC.
            if (npc != null) {
                discordIds = yield this.worldController.getDiscordId(npc.worldId);
            }
            return MessageUtility_1.MessageUtility.sendPrivateMessages(discordIds, message, completionMessage, messageToSend);
        });
    }
    /**
     * Gets all the unreplied messages.
     *
     * @param command The command originally sent.
     * @param message Message object of the originating command.
     * @param user The user doing the command.
     */
    getUnrepliedSendings(command, user, message) {
        return __awaiter(this, void 0, void 0, function* () {
            // Process the next  command.
            const nextCmd = Subcommands_1.Subcommands.NEXT.getCommand(command);
            let page = StringUtility_1.StringUtility.getNumber(nextCmd.getInput());
            if (page == null) {
                if (nextCmd.getInput() == null) {
                    page = 1;
                }
                else {
                    page = 0;
                }
            }
            let arr = yield this.getSendingArray(user.defaultWorld, user.defaultCharacter, null, message);
            // If both are null, return a standard message.
            if (arr.world == null && arr.character == null) {
                return message.channel.send(SendingHelpRelatedResponses_1.SendingHelpRelatedResponses.NO_DEFAULT_WORLD_OR_CHARACTER());
            }
            const messages = yield this.sendingController.get(page, arr.world, arr.npc, arr.character);
            let embed;
            if (arr.character != null) {
                embed = SendingHelpRelatedResponses_1.SendingHelpRelatedResponses.PRINT_MESSAGES_TO_CHARACTER(messages, arr.character, page, this.encryptionUtility);
            }
            else {
                embed = SendingHelpRelatedResponses_1.SendingHelpRelatedResponses.PRINT_MESSAGES_FROM_WORLD(messages, arr.world, page, this.encryptionUtility);
            }
            return message.channel.send(embed);
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
                let day = StringUtility_1.StringUtility.getNumber(dates[0]), month = StringUtility_1.StringUtility.getNumber(dates[1]), year = StringUtility_1.StringUtility.getNumber(dates[2]);
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
                // Message is for another player character.
                if (Subcommands_1.Subcommands.TO.isCommand(command)) {
                    const toCmd = Subcommands_1.Subcommands.TO.getCommand(command);
                    // Get all the parties in this world.
                    if (world == null) {
                        return null;
                    }
                    const parties = yield this.partyController.getByWorld(world);
                    if (parties == null) {
                        yield message.channel.send("No parties exist in world.");
                        return null;
                    }
                    const characters = yield this.characterController.getCharacterByNameInParties(toCmd.getInput(), parties);
                    if (characters == null) {
                        yield message.channel.send("No characters exist in world with name like: " + toCmd.getInput());
                        return null;
                    }
                    // TODO: Allow multiselect characters.
                    sending.toPlayerId = characters[0].id;
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
};
SendingCommandHandler = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.CharacterController)),
    __param(1, inversify_1.inject(types_1.TYPES.EncryptionUtility)),
    __param(2, inversify_1.inject(types_1.TYPES.PartyController)),
    __param(3, inversify_1.inject(types_1.TYPES.NPCController)),
    __param(4, inversify_1.inject(types_1.TYPES.SendingController)),
    __param(5, inversify_1.inject(types_1.TYPES.WorldController)),
    __metadata("design:paramtypes", [CharacterController_1.CharacterController,
        EncryptionUtility_1.EncryptionUtility,
        PartyController_1.PartyController,
        NPCController_1.NPCController,
        SendingController_1.SendingController,
        WorldController_1.WorldController])
], SendingCommandHandler);
exports.SendingCommandHandler = SendingCommandHandler;
//# sourceMappingURL=SendingCommandHandler.js.map