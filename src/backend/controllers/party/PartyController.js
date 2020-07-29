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
exports.PartyController = void 0;
const Table_1 = require("../../../shared/documentation/databases/Table");
const Party_1 = require("../../../entity/Party");
const inversify_1 = require("inversify");
const AbstractController_1 = require("../Base/AbstractController");
const NameValuePair_1 = require("../Base/NameValuePair");
const Subcommands_1 = require("../../../shared/documentation/commands/Subcommands");
const PartyRelatedClientResponses_1 = require("../../../shared/documentation/client-responses/information/PartyRelatedClientResponses");
let PartyController = class PartyController extends AbstractController_1.AbstractController {
    constructor() {
        super(Table_1.Table.PARTY);
    }
    /**
     * Creates a new party in the server with the given name.
     *
     * @param partyName The name of the party.
     * @param guildId The ID of the guild for this party to live in.
     * @param discordId The discord id of the creator.
     */
    create(partyName, guildId, discordId) {
        const party = new Party_1.Party();
        party.name = partyName;
        party.guildId = guildId;
        party.creatorDiscordId = discordId;
        return this.getRepo().save(party).then((party) => {
            return party;
        }).catch((err) => {
            console.error("ERR ::: Could not create new party.");
            console.error(err);
            return null;
        });
    }
    save(party) {
        return this.getRepo().save(party).then((party) => {
            return party;
        }).catch((err) => {
            console.error("ERR ::: Could not save party.");
            console.error(err);
            return null;
        });
    }
    /**
     * Gets the party by the ID.
     *
     * @param id The ID of the party.
     */
    getById(id) {
        return this.getRepo().findOne({ where: { id: id } }).then((party) => {
            if (party == undefined) {
                return null;
            }
            return party;
        }).catch((err) => {
            console.error("ERR ::: Could not get party.");
            console.error(err);
            return null;
        });
    }
    getByGuild(guildId) {
        return this.getRepo().find({ where: { guildId: guildId } }).then((parties) => {
            if (parties == undefined) {
                return null;
            }
            return parties;
        }).catch((err) => {
            console.error("ERR ::: Could not get parties in guild.");
            console.error(err);
            return null;
        });
    }
    getByWorld(world) {
        return this.getRepo().find({ where: { world: world } }).then((parties) => {
            if (parties == undefined || parties.length < 1) {
                return null;
            }
            return parties;
        }).catch((err) => {
            console.error("ERR ::: Could not get parties in world.");
            console.error(err);
            return null;
        });
    }
    updatePartyWorld(party, world) {
        party.world = world;
        return this.getRepo().save(party);
    }
    /**
     * Gets all parties in the given guild with a name similar.
     *
     * @param partyName The name of the party to get.
     * @param guildId The ID of the guild the party lives in.
     */
    getByNameAndGuild(partyName, guildId) {
        return this.getLikeArgs([new NameValuePair_1.NameValuePair("guild_id", guildId)], [new NameValuePair_1.NameValuePair("name", partyName)])
            .catch((err) => {
            console.error("ERR ::: Could not get parties.");
            console.error(err);
            return null;
        });
    }
    getPartyBasedOnInputOrUser(command, message, user, action) {
        return __awaiter(this, void 0, void 0, function* () {
            // Check the user has assigned a party or has one.
            let parties = null;
            if (Subcommands_1.Subcommands.PARTY.isCommand(command)) {
                let ptCmd = Subcommands_1.Subcommands.PARTY.getCommand(command);
                if (ptCmd.getInput() != null) {
                    parties = yield this.getByNameAndGuild(ptCmd.getInput(), message.guild.id);
                }
            }
            if (parties == null) {
                parties = [];
                if (user.defaultCharacter != null && user.defaultCharacter.party != null) {
                    parties.push(user.defaultCharacter.party);
                }
                if (user.defaultParty != null) {
                    parties.push(user.defaultParty);
                }
            }
            // Nothing to return.
            if (parties.length <= 0) {
                return Promise.resolve(null);
            }
            // No need to ask the user which one they want to use.
            if (parties.length == 1) {
                return Promise.resolve(parties[0]);
            }
            return this.partySelection(parties, action, message);
        });
    }
    partySelection(parties, action, message) {
        return __awaiter(this, void 0, void 0, function* () {
            return message.channel.send(PartyRelatedClientResponses_1.PartyRelatedClientResponses.SELECT_PARTY(parties, action)).then((msg) => {
                return message.channel.awaitMessages(m => m.author.id === message.author.id, {
                    max: 1,
                    time: 10e3,
                    errors: ['time'],
                }).then((input) => {
                    msg.delete({ reason: "Removed party processing command." });
                    let content = input.first().content;
                    let choice = Number(content);
                    if (isNaN(choice) || choice >= parties.length || choice < 0) {
                        message.channel.send("Input doesn't make sense!");
                        return null;
                    }
                    input.first().delete();
                    return parties[choice];
                }).catch(() => {
                    msg.delete({ reason: "Removed party processing command." });
                    message.channel.send("Message timed out.");
                    return null;
                });
            });
        });
    }
};
PartyController = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [])
], PartyController);
exports.PartyController = PartyController;
//# sourceMappingURL=PartyController.js.map