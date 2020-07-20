"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PartyController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PartyController = void 0;
const typeorm_1 = require("typeorm");
const Table_1 = require("../documentation/databases/Table");
const Party_1 = require("../entity/Party");
const inversify_1 = require("inversify");
let PartyController = PartyController_1 = class PartyController {
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
        return PartyController_1.getRepo().save(party).then((party) => {
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
        return PartyController_1.getRepo().findOne({ where: { id: id } }).then((party) => {
            if (party == undefined) {
                return null;
            }
            return party;
        });
    }
    /**
     * Gets all parties in the given guild with a name similar.
     *
     * @param partyName The name of the party to get.
     * @param guildId The ID of the guild the party lives in.
     */
    getByNameAndGuild(partyName, guildId) {
        return PartyController_1.getRepo()
            .createQueryBuilder(Table_1.Table.PARTY)
            .where("guild_id = :id AND LOWER(name) LIKE LOWER('%:name%')", { id: guildId, name: partyName })
            .getMany()
            .then((parties) => {
            if (parties == null || parties.length < 1) {
                return null;
            }
            if (parties.length < 2) {
                return parties[0];
            }
            return parties;
        })
            .catch((err) => {
            console.error("ERR ::: Could not get parties.");
            console.error(err);
            return null;
        });
    }
    /**
     * Gets the repo.
     */
    static getRepo() {
        return typeorm_1.getManager().getRepository(Table_1.Table.PARTY);
    }
};
PartyController = PartyController_1 = __decorate([
    inversify_1.injectable()
], PartyController);
exports.PartyController = PartyController;
//# sourceMappingURL=PartyController.js.map