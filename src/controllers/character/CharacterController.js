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
exports.CharacterController = void 0;
const Character_1 = require("../../entity/Character");
const inversify_1 = require("inversify");
const Table_1 = require("../../documentation/databases/Table");
const Nickname_1 = require("../../entity/Nickname");
const AbstractSecondaryController_1 = require("../Base/AbstractSecondaryController");
const NameValuePair_1 = require("../Base/NameValuePair");
const typeorm_1 = require("typeorm");
const StringUtility_1 = require("../../utilities/StringUtility");
let CharacterController = class CharacterController extends AbstractSecondaryController_1.AbstractSecondaryController {
    constructor() {
        super(Table_1.Table.CHARACTER, Table_1.Table.USER_TO_CHARACTER);
    }
    /**
     * Gets a character by ID.
     *
     * @param id The ID of the character to get.
     */
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Not a valid argument.
            if (id == null || id < 1) {
                return null;
            }
            return this.getRepo().findOne({ where: { id: id }, relations: ["party", "travel_config"] })
                .then((character) => {
                // Check the party is valid.
                return character;
            })
                .catch((err) => {
                console.error("ERR ::: Could not get character by ID.");
                console.error(err);
                return null;
            });
        });
    }
    create(character, discordId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Create nickname for the mapping.
            const nickname = new Nickname_1.Nickname();
            nickname.discord_id = discordId;
            nickname.character = character;
            nickname.name = character.name;
            // Add the nickname to the character.
            character.nicknames = [];
            character.nicknames.push(nickname);
            return this.getRepo().save(character).then((char) => {
                if (!char) {
                    return null;
                }
                return this.createNickname(nickname.name, char, discordId).then((nick) => {
                    if (nick == null) {
                        return this.getRepo().delete(char).then(() => {
                            return null;
                        }).catch((err) => {
                            console.error("ERR ::: Could not delete character after failed nickname mapping.");
                            console.log(err.stack);
                            return null;
                        });
                    }
                    return char;
                });
            }).catch((err) => {
                console.error("ERR ::: Could not create the new character.");
                console.log(err.stack);
                return null;
            });
        });
    }
    createNickname(nickname, character, discordId) {
        return __awaiter(this, void 0, void 0, function* () {
            const nn = new Nickname_1.Nickname();
            nn.discord_id = discordId;
            nn.name = nickname;
            nn.character = character;
            return this.getSecondaryRepo().save(nn).catch((err) => {
                console.error("ERR ::: Could not create new nickname.");
                console.error(err);
                return null;
            });
        });
    }
    getCharacterByNameInParties(name, parties) {
        return __awaiter(this, void 0, void 0, function* () {
            let sanitizedName = StringUtility_1.StringUtility.escapeSQLInput(name);
            let partyIds = [], i;
            for (i = 0; i < parties.length; i++) {
                partyIds.push(parties[i].id);
            }
            return typeorm_1.getConnection()
                .createQueryBuilder(Character_1.Character, "character")
                .leftJoinAndSelect(Nickname_1.Nickname, "nick", `character.id = "nick"."characterId"`)
                .where(`LOWER("nick"."name") LIKE LOWER('%${sanitizedName}%')`)
                .andWhere(`"character"."partyId" = ANY(ARRAY[${partyIds.join(",")}])`)
                .distinctOn(["character.id"])
                .getMany()
                .then((characters) => {
                if (!characters || characters.length < 1) {
                    return null;
                }
                return characters;
            })
                .catch((err) => {
                console.error("ERR ::: Could not get characters.");
                console.error(err);
                return null;
            });
        });
    }
    getCharacterByName(name, discordId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getNicknameByNickname(name, discordId).then((nickname) => {
                if (nickname == null || nickname.length < 1) {
                    return null;
                }
                console.debug("Found nickname! Nickname: " + nickname[0].name);
                if (nickname[0].character == null) {
                    return this.getById(nickname[0].characterId);
                }
                return nickname[0].character;
            });
        });
    }
    /**
     * Gets all the discord IDs related to this character.
     * @param characterId
     */
    getDiscordId(characterId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getSecondaryRepo().find({ where: { characterId: characterId } }).then((nicknames) => {
                if (!nicknames || nicknames.length < 1) {
                    return null;
                }
                let input = [], nickname, discordId, i;
                for (i = 0; i < nicknames.length; i++) {
                    nickname = nicknames[i];
                    discordId = nickname.discord_id;
                    if (!input.includes(discordId)) {
                        input.push(discordId);
                    }
                }
                return input;
            });
        });
    }
    getNicknameByNickname(nickname, discordId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getSecondaryLikeArgs([new NameValuePair_1.NameValuePair("discord_id", discordId)], [new NameValuePair_1.NameValuePair("name", nickname)])
                .catch((err) => {
                console.error("ERR ::: Could not get nickname.");
                console.error(err);
                return null;
            });
        });
    }
};
CharacterController = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [])
], CharacterController);
exports.CharacterController = CharacterController;
//# sourceMappingURL=CharacterController.js.map