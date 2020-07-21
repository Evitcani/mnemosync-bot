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
const inversify_1 = require("inversify");
const Table_1 = require("../documentation/databases/Table");
const Nickname_1 = require("../entity/Nickname");
const AbstractSecondaryController_1 = require("./Base/AbstractSecondaryController");
const NameValuePair_1 = require("./Base/NameValuePair");
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
            return this.getRepo().findOne({ where: { id: id } }).catch((err) => {
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
                return this.createNickname(character.name, character, discordId).then((nick) => {
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
    getCharacterByName(name, discordId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getNicknameByNickname(name, discordId).then((nickname) => {
                if (nickname == null || nickname.length < 1) {
                    return null;
                }
                return nickname[0].character;
            });
        });
    }
    getNicknameByNickname(nickname, discordId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getLikeArgs([new NameValuePair_1.NameValuePair("discord_id", discordId)], [new NameValuePair_1.NameValuePair("name", nickname)])
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