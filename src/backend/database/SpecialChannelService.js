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
var SpecialChannelService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecialChannelService = void 0;
const inversify_1 = require("inversify");
const DatabaseService_1 = require("./base/DatabaseService");
const types_1 = require("../../types");
const StringUtility_1 = require("../utilities/StringUtility");
let SpecialChannelService = SpecialChannelService_1 = class SpecialChannelService {
    constructor(databaseService) {
        this.databaseService = databaseService;
    }
    getSpecialChannel(guildId, channelDesignation) {
        return __awaiter(this, void 0, void 0, function* () {
            // Sanitize inputs.
            const sanitizedGuildId = StringUtility_1.StringUtility.escapeMySQLInput(guildId);
            // Construct query.
            let query = `SELECT * FROM ${SpecialChannelService_1.TABLE_NAME} WHERE guild_id = ${sanitizedGuildId} AND designation = ${channelDesignation}`;
            // Construct query.
            return this.databaseService.query(query).then((res) => {
                if (res.rowCount <= 0) {
                    return null;
                }
                // @ts-ignore
                const result = res.rows[0];
                return result;
            }).catch((err) => {
                console.log("QUERY USED: " + query);
                console.log("ERROR: Could not get the special channel for the guild. ::: " + err.message);
                console.log(err.stack);
                return null;
            });
        });
    }
    addSpecialChannel(guildId, channelDesignation, channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            // First check if there's already an entry.
            return this.getSpecialChannel(guildId, channelDesignation).then((channel) => {
                if (channel != null) {
                    return this.updateSpecialChannel(guildId, channelDesignation, channelId);
                }
                // Sanitize inputs.
                const sanitizedGuildId = StringUtility_1.StringUtility.escapeMySQLInput(guildId);
                const sanitizedChannelId = StringUtility_1.StringUtility.escapeMySQLInput(channelId);
                // Construct query.
                let query = `INSERT INTO ${SpecialChannelService_1.TABLE_NAME} (guild_id, designation, channel_id) VALUES (${sanitizedGuildId}, ${channelDesignation}, ${sanitizedChannelId})`;
                // Construct query.
                return this.databaseService.query(query).then(() => {
                    return this.getSpecialChannel(guildId, channelDesignation);
                }).catch((err) => {
                    console.log("QUERY USED: " + query);
                    console.log("ERROR: Could not add the new special channel. ::: " + err.message);
                    console.log(err.stack);
                    return null;
                });
            });
        });
    }
    /**
     * Updates the special channel for the designation.
     *
     * @param guildId
     * @param channelDesignation
     * @param channelId
     */
    updateSpecialChannel(guildId, channelDesignation, channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Sanitize inputs.
            const sanitizedGuildId = StringUtility_1.StringUtility.escapeMySQLInput(guildId);
            const sanitizedChannelId = StringUtility_1.StringUtility.escapeMySQLInput(channelId);
            // Construct query.
            let query = `UPDATE ${SpecialChannelService_1.TABLE_NAME} SET channel_id = ${sanitizedChannelId} WHERE guild_id = ${sanitizedGuildId} AND designation = ${channelDesignation}`;
            // Construct query.
            return this.databaseService.query(query).then(() => {
                return this.getSpecialChannel(guildId, channelDesignation);
            }).catch((err) => {
                console.log("QUERY USED: " + query);
                console.log("ERROR: Could not update the special channel. ::: " + err.message);
                console.log(err.stack);
                return null;
            });
        });
    }
};
SpecialChannelService.TABLE_NAME = "special_channels";
SpecialChannelService = SpecialChannelService_1 = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.DatabaseService)),
    __metadata("design:paramtypes", [DatabaseService_1.DatabaseService])
], SpecialChannelService);
exports.SpecialChannelService = SpecialChannelService;
//# sourceMappingURL=SpecialChannelService.js.map