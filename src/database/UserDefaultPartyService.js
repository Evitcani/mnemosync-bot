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
var UserDefaultPartyService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDefaultPartyService = void 0;
const DatabaseService_1 = require("./DatabaseService");
const inversify_1 = require("inversify");
const types_1 = require("../types");
const StringUtility_1 = require("../utilities/StringUtility");
let UserDefaultPartyService = UserDefaultPartyService_1 = class UserDefaultPartyService {
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    /**
     * Gets all the parties related to the given guild.
     *
     * @param guildId The ID of the guild to get all the parties for.
     * @param discordId The ID of the user.
     */
    getDefaultParty(guildId, discordId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Sanitize inputs.
            guildId = StringUtility_1.StringUtility.escapeMySQLInput(guildId);
            discordId = StringUtility_1.StringUtility.escapeMySQLInput(discordId);
            console.log(`Searching for guild (ID: ${guildId}) for user (ID: ${discordId})...`);
            // Construct query.
            let query = `SELECT party_id FROM ${UserDefaultPartyService_1.TABLE_NAME} WHERE guild_id = '${guildId}' AND discord_id = '${discordId}'`;
            return this.databaseService.query(query).then((res) => {
                console.log(res);
                // @ts-ignore
                const result = res.rows[0];
                return result;
            }).catch((err) => {
                console.log("ERROR: Could not get guilds. ::: " + err.message);
                console.log(err.stack);
                return null;
            });
        });
    }
    /**
     * Registers a party to a given guild.
     *
     * @param partyId The ID of the party to register.
     * @param guildId The ID of the guild to register the party to.
     * @param discordId The ID of the user.
     */
    addDefaultParty(partyId, guildId, discordId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Sanitize inputs.
            guildId = StringUtility_1.StringUtility.escapeMySQLInput(guildId);
            discordId = StringUtility_1.StringUtility.escapeMySQLInput(discordId);
            // Construct query.
            let query = `INSERT INTO ${UserDefaultPartyService_1.TABLE_NAME} (party_id, guild_id, discord_id) VALUES (${partyId}, '${guildId}', '${discordId}')`;
            return this.databaseService.query(query).then(() => {
                return this.getDefaultParty(guildId, discordId);
            }).catch((err) => {
                console.log("ERROR: Could not get guilds. ::: " + err.message);
                console.log(err.stack);
                return null;
            });
        });
    }
};
UserDefaultPartyService.TABLE_NAME = "user_default_parties";
UserDefaultPartyService = UserDefaultPartyService_1 = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.DatabaseService)),
    __metadata("design:paramtypes", [DatabaseService_1.DatabaseService])
], UserDefaultPartyService);
exports.UserDefaultPartyService = UserDefaultPartyService;
//# sourceMappingURL=UserDefaultPartyService.js.map