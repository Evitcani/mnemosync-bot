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
exports.CharacterCommandHandler = void 0;
const Character_1 = require("../../../../../entity/Character");
const Subcommands_1 = require("../../../../../shared/documentation/commands/Subcommands");
const inversify_1 = require("inversify");
const types_1 = require("../../../../../types");
const CharacterRelatedClientResponses_1 = require("../../../../../shared/documentation/client-responses/character/CharacterRelatedClientResponses");
const PartyController_1 = require("../../../../../backend/controllers/party/PartyController");
const CharacterController_1 = require("../../../../../backend/controllers/character/CharacterController");
const AbstractUserCommandHandler_1 = require("../../../base/AbstractUserCommandHandler");
const UserController_1 = require("../../../../../backend/controllers/user/UserController");
const NonPlayableCharacter_1 = require("../../../../../entity/NonPlayableCharacter");
const NPCController_1 = require("../../../../../backend/controllers/character/NPCController");
const WorldController_1 = require("../../../../../backend/controllers/world/WorldController");
let CharacterCommandHandler = class CharacterCommandHandler extends AbstractUserCommandHandler_1.AbstractUserCommandHandler {
    constructor(characterController, npcController, partyController, userController, worldController) {
        super();
        this.characterController = characterController;
        this.npcController = npcController;
        this.partyController = partyController;
        this.userController = userController;
        this.worldController = worldController;
    }
    handleUserCommand(command, message, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Subcommands_1.Subcommands.CREATE.isCommand(command)) {
                if (Subcommands_1.Subcommands.NPC.isCommand(command)) {
                    return this.constructNPC(command, message, user, new NonPlayableCharacter_1.NonPlayableCharacter()).then((npc) => {
                        return this.npcController.create(npc).then((character) => {
                            if (character == null) {
                                return message.channel.send("Could not create new NPC.");
                            }
                            return message.channel.send("Created new NPC: " + character.name);
                        });
                    });
                }
                return this.constructCharacter(command, message, user, true).then((character) => {
                    return this.createCharacter(message, character, user);
                });
            }
            // Switches the character over.
            if (Subcommands_1.Subcommands.SWITCH.isCommand(command)) {
                const switchCmd = Subcommands_1.Subcommands.SWITCH.getCommand(command);
                return this.switchCharacter(message, switchCmd, user);
            }
            // Nickname adding to the character.
            if (Subcommands_1.Subcommands.NICKNAME.isCommand(command)) {
                const nickCmd = Subcommands_1.Subcommands.NICKNAME.getCommand(command);
                return this.addNickname(nickCmd, message, user);
            }
            return undefined;
        });
    }
    /**
     * Switches the character.
     *
     * @param message
     * @param cmd
     * @param user
     */
    switchCharacter(message, cmd, user) {
        return __awaiter(this, void 0, void 0, function* () {
            // Go out and get the character.
            let char = yield this.characterController.getCharacterByName(cmd.getInput(), message.author.id);
            // Couldn't find character.
            if (char == null) {
                return message.channel.send(`No character exists with a name like '${cmd.getInput()}'`);
            }
            // Update the default character.
            yield this.userController.updateDefaultCharacter(user, char);
            // Return message.
            return message.channel.send(CharacterRelatedClientResponses_1.CharacterRelatedClientResponses.NOW_PLAYING_AS_CHARACTER(char, false));
        });
    }
    addNickname(command, message, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user == null || user.defaultCharacter == null) {
                return message.channel.send("Unable to add nickname to character. No default character.");
            }
            let nick = yield this.characterController.createNickname(command.getInput(), user.defaultCharacter, message.author.id);
            if (nick == null) {
                return message.channel.send("Unable to add nickname to character.");
            }
            return message.channel.send("Added nickname to character!");
        });
    }
    /**
     * Creates a character.
     *
     * @param message The message object that spurred this command.
     * @param character The character to create.
     * @param user The user
     */
    createCharacter(message, character, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (character == null || character.name == null) {
                return message.channel.send("You must provide a name for the character!");
            }
            return this.characterController.create(character, message.author.id)
                .then((char) => {
                if (char == null) {
                    return message.channel.send("Could not create character.");
                }
                return this.userController.updateDefaultCharacter(user, char).then(() => {
                    return message.channel.send(CharacterRelatedClientResponses_1.CharacterRelatedClientResponses.NOW_PLAYING_AS_CHARACTER(character, true));
                });
            });
        });
    }
    /**
     * Constructs an NPC.
     *
     * @param command The command originally sent.
     * @param message Message object of the originating command.
     * @param user The user doing the command.
     * @param character The character to update with the given command.
     */
    constructNPC(command, message, user, character) {
        return __awaiter(this, void 0, void 0, function* () {
            const nameCmd = CharacterCommandHandler.getNameCmd(command);
            if (nameCmd != null) {
                character.name = nameCmd.getInput();
            }
            return this.worldController.worldSelectionFromUser(user, message).then((world) => {
                if (world != null) {
                    character.world = world;
                }
                return character;
            });
        });
    }
    constructCharacter(command, message, user, isNew) {
        return __awaiter(this, void 0, void 0, function* () {
            // Construct the character and add the name.
            const character = (isNew || user.defaultCharacter == null) ? new Character_1.Character() : user.defaultCharacter;
            // Set the image URL.
            if (Subcommands_1.Subcommands.IMG_URL.isCommand(command)) {
                const imgCmd = Subcommands_1.Subcommands.IMG_URL.getCommand(command);
                character.img_url = imgCmd.getInput();
            }
            // Set the character name
            const nameCmd = CharacterCommandHandler.getNameCmd(command);
            if (nameCmd != null) {
                character.name = nameCmd.getInput();
            }
            // Get the party if there is one.
            if (Subcommands_1.Subcommands.PARTY.isCommand(command)) {
                const ptCmd = Subcommands_1.Subcommands.PARTY.getCommand(command);
                return this.partyController.getByNameAndGuild(ptCmd.getInput(), message.guild.id)
                    .then((parties) => {
                    if (parties == null || parties.length != 1) {
                        console.debug("Found either no parties or too many parties!");
                        return null;
                    }
                    character.party = parties[0];
                    return character;
                });
            }
            return Promise.resolve(character);
        });
    }
    /**
     * Gets the command containing the name of the character.
     *
     * @param command The command that may contain the name.
     */
    static getNameCmd(command) {
        if (Subcommands_1.Subcommands.CREATE.isCommand(command)) {
            return Subcommands_1.Subcommands.CREATE.getCommand(command);
        }
        if (Subcommands_1.Subcommands.UPDATE.isCommand(command)) {
            return Subcommands_1.Subcommands.UPDATE.getCommand(command);
        }
        if (Subcommands_1.Subcommands.SWITCH.isCommand(command)) {
            return Subcommands_1.Subcommands.SWITCH.getCommand(command);
        }
        return null;
    }
};
CharacterCommandHandler = __decorate([
    __param(0, inversify_1.inject(types_1.TYPES.CharacterController)),
    __param(1, inversify_1.inject(types_1.TYPES.NPCController)),
    __param(2, inversify_1.inject(types_1.TYPES.PartyController)),
    __param(3, inversify_1.inject(types_1.TYPES.UserController)),
    __param(4, inversify_1.inject(types_1.TYPES.WorldController)),
    __metadata("design:paramtypes", [CharacterController_1.CharacterController,
        NPCController_1.NPCController,
        PartyController_1.PartyController,
        UserController_1.UserController,
        WorldController_1.WorldController])
], CharacterCommandHandler);
exports.CharacterCommandHandler = CharacterCommandHandler;
//# sourceMappingURL=CharacterCommandHandler.js.map