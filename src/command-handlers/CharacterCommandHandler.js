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
const AbstractCommandHandler_1 = require("./base/AbstractCommandHandler");
const Character_1 = require("../entity/Character");
const Subcommands_1 = require("../documentation/commands/Subcommands");
const inversify_1 = require("inversify");
const types_1 = require("../types");
const CharacterService_1 = require("../database/CharacterService");
const CharacterRelatedClientResponses_1 = require("../documentation/client-responses/CharacterRelatedClientResponses");
const PartyService_1 = require("../database/PartyService");
const UserService_1 = require("../database/UserService");
let CharacterCommandHandler = class CharacterCommandHandler extends AbstractCommandHandler_1.AbstractCommandHandler {
    constructor(characterService, partyService, userService) {
        super();
        this.characterService = characterService;
        this.partyService = partyService;
        this.userService = userService;
    }
    handleCommand(command, message) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.constructCharacter(command, message).then((character) => {
                if (Subcommands_1.Subcommands.CREATE.isCommand(command) != null) {
                    return this.createCharacter(message, character);
                }
                if (Subcommands_1.Subcommands.SWITCH.isCommand(command) != null) {
                    return this.switchCharacter(message, character);
                }
                return undefined;
            });
        });
    }
    switchCharacter(message, character) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.characterService.getCharacterByName(message.author.id, character.name).then((char) => {
                if (char == null) {
                    return message.channel.send(`No character exists with a name like '${character.name}'`);
                }
                return this.userService.updateDefaultCharacter(message.author.id, message.author.username, char).then(() => {
                    return message.channel.send(CharacterRelatedClientResponses_1.CharacterRelatedClientResponses.NOW_PLAYING_AS_CHARACTER(char, false));
                });
            });
        });
    }
    /**
     * Creates a character.
     *
     * @param message
     * @param character The character to create.
     */
    createCharacter(message, character) {
        return __awaiter(this, void 0, void 0, function* () {
            if (character == null || character.name == null) {
                return message.channel.send("You must provide a name for the character!");
            }
            return this.characterService.createCharacter(character, message.author.id, message.author.username)
                .then((character) => {
                return message.channel.send(CharacterRelatedClientResponses_1.CharacterRelatedClientResponses.NOW_PLAYING_AS_CHARACTER(character, true));
            });
        });
    }
    constructCharacter(command, message) {
        return __awaiter(this, void 0, void 0, function* () {
            // Construct the character and add the name.
            const character = new Character_1.Character();
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
            else {
                // Get this user's default character.
                return this.characterService.getUserWithCharacter(message.author.id, message.author.username).then((user) => {
                    if (user == null || user.defaultCharacter) {
                        return null;
                    }
                    character.id = user.defaultCharacter.id;
                    return this.getOtherValues(command, message, character);
                });
            }
            return this.getOtherValues(command, message, character);
        });
    }
    getOtherValues(command, message, character) {
        // See if we were given a party...
        const ptCmd = Subcommands_1.Subcommands.PARTY.isCommand(command);
        if (ptCmd != null) {
            return this.partyService.getPartiesInGuildWithName(message.guild.id, ptCmd.getInput())
                .then((parties) => {
                if (parties == null || parties.length != 1) {
                    console.debug("Found either no parties or too many parties!");
                    return null;
                }
                const party = parties[0];
                character.party = party;
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
    __param(0, inversify_1.inject(types_1.TYPES.CharacterService)),
    __param(1, inversify_1.inject(types_1.TYPES.PartyService)),
    __param(2, inversify_1.inject(types_1.TYPES.UserService)),
    __metadata("design:paramtypes", [CharacterService_1.CharacterService,
        PartyService_1.PartyService,
        UserService_1.UserService])
], CharacterCommandHandler);
exports.CharacterCommandHandler = CharacterCommandHandler;
//# sourceMappingURL=CharacterCommandHandler.js.map