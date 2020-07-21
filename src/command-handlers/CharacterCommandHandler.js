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
const Character_1 = require("../entity/Character");
const Subcommands_1 = require("../documentation/commands/Subcommands");
const inversify_1 = require("inversify");
const types_1 = require("../types");
const CharacterRelatedClientResponses_1 = require("../documentation/client-responses/CharacterRelatedClientResponses");
const PartyController_1 = require("../controllers/PartyController");
const CharacterController_1 = require("../controllers/CharacterController");
const AbstractUserCommandHandler_1 = require("./base/AbstractUserCommandHandler");
const UserController_1 = require("../controllers/UserController");
let CharacterCommandHandler = class CharacterCommandHandler extends AbstractUserCommandHandler_1.AbstractUserCommandHandler {
    constructor(characterController, partyController, userController) {
        super();
        this.characterController = characterController;
        this.partyController = partyController;
        this.userController = userController;
    }
    handleUserCommand(command, message, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Subcommands_1.Subcommands.CREATE.isCommand(command) != null) {
                return this.constructCharacter(command, message, user, true).then((character) => {
                    return this.createCharacter(message, character, user);
                });
            }
            const switchCmd = Subcommands_1.Subcommands.SWITCH.isCommand(command);
            if (switchCmd != null) {
                return this.switchCharacter(message, switchCmd, user);
            }
            const nickCmd = Subcommands_1.Subcommands.NICKNAME.isCommand(command);
            if (nickCmd != null) {
                return this.addNickname(nickCmd, message, user);
            }
            return undefined;
        });
    }
    switchCharacter(message, cmd, user) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.characterController.getCharacterByName(cmd.getInput(), message.author.id).then((char) => {
                if (char == null) {
                    return message.channel.send(`No character exists with a name like '${cmd.getInput()}'`);
                }
                return this.userController.updateDefaultCharacter(user, char).then(() => {
                    return message.channel.send(CharacterRelatedClientResponses_1.CharacterRelatedClientResponses.NOW_PLAYING_AS_CHARACTER(char, false));
                });
            });
        });
    }
    addNickname(command, message, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user == null || user.defaultCharacter == null) {
                return message.channel.send("Unable to add nickname to character. No default character.");
            }
            return this.characterController.createNickname(command.getInput(), user.defaultCharacter, message.author.id)
                .then((nick) => {
                if (nick == null) {
                    return message.channel.send("Unable to add nickname to character.");
                }
                return message.channel.send("Added nickname to character!");
            });
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
    constructCharacter(command, message, user, isNew) {
        return __awaiter(this, void 0, void 0, function* () {
            // Construct the character and add the name.
            const character = (isNew || user.defaultCharacter == null) ? new Character_1.Character() : user.defaultCharacter;
            // Set the image URL.
            const imgCmd = Subcommands_1.Subcommands.IMG_URL.isCommand(command);
            if (imgCmd != null) {
                character.img_url = imgCmd.getInput();
            }
            // Set the character name
            const nameCmd = CharacterCommandHandler.getNameCmd(command);
            if (nameCmd != null) {
                character.name = nameCmd.getInput();
            }
            return this.getOtherValues(command, message, character);
        });
    }
    getOtherValues(command, message, character) {
        // See if we were given a party...
        const ptCmd = Subcommands_1.Subcommands.PARTY.isCommand(command);
        if (ptCmd != null) {
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
    }
    static getNameCmd(command) {
        let nameCmd = Subcommands_1.Subcommands.CREATE.isCommand(command);
        if (nameCmd != null) {
            return nameCmd;
        }
        nameCmd = Subcommands_1.Subcommands.UPDATE.isCommand(command);
        if (nameCmd != null) {
            return nameCmd;
        }
        nameCmd = Subcommands_1.Subcommands.SWITCH.isCommand(command);
        if (nameCmd != null) {
            return nameCmd;
        }
        return null;
    }
};
CharacterCommandHandler = __decorate([
    __param(0, inversify_1.inject(types_1.TYPES.CharacterController)),
    __param(1, inversify_1.inject(types_1.TYPES.PartyController)),
    __param(2, inversify_1.inject(types_1.TYPES.UserController)),
    __metadata("design:paramtypes", [CharacterController_1.CharacterController,
        PartyController_1.PartyController,
        UserController_1.UserController])
], CharacterCommandHandler);
exports.CharacterCommandHandler = CharacterCommandHandler;
//# sourceMappingURL=CharacterCommandHandler.js.map