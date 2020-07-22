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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartyController = void 0;
const Table_1 = require("../documentation/databases/Table");
const Party_1 = require("../entity/Party");
const inversify_1 = require("inversify");
const AbstractController_1 = require("./Base/AbstractController");
const NameValuePair_1 = require("./Base/NameValuePair");
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
};
PartyController = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [])
], PartyController);
exports.PartyController = PartyController;
//# sourceMappingURL=PartyController.js.map