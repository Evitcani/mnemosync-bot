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
exports.QuoteCommandHandler = void 0;
const inversify_1 = require("inversify");
const AbstractCommandHandler_1 = require("./base/AbstractCommandHandler");
const discord_js_1 = require("discord.js");
const types_1 = require("../types");
const SpecialChannelService_1 = require("../database/SpecialChannelService");
const SpecialChannelDesignation_1 = require("../enums/SpecialChannelDesignation");
const QuoteRelatedClientResponses_1 = require("../documentation/client-responses/QuoteRelatedClientResponses");
const delay = require('delay');
/**
 * Handles the "quote" command from users. This command allows a user to designate a channel as the "quote" channel and
 * then fetch random quotes from it.
 */
let QuoteCommandHandler = class QuoteCommandHandler extends AbstractCommandHandler_1.AbstractCommandHandler {
    constructor(client, specialChannelService) {
        super();
        this.client = client;
        this.specialChannelService = specialChannelService;
    }
    handleCommand(command, message) {
        return __awaiter(this, void 0, void 0, function* () {
            // Registering the channel.
            if (command.getInput() != null && command.getInput().toLowerCase() == "here") {
                return this.registerQuoteChannel(message);
            }
            // Otherwise gets a random quote from the quote channel.
            return this.getRandomQuote(message).then((msg) => {
                return message.channel.send(QuoteRelatedClientResponses_1.QuoteRelatedClientResponses.QUOTED_MESSAGE(msg));
            });
        });
    }
    registerQuoteChannel(message) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.specialChannelService.addSpecialChannel(message.guild.id, SpecialChannelDesignation_1.SpecialChannelDesignation.QUOTE_CHANNEL, message.channel.id)
                .then(() => {
                return message.channel.send("Registered this channel as your quotes channel!");
            });
        });
    }
    getRandomQuote(message) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getQuoteChannel(message).then((channelId) => {
                return this.getAllMessages(message, channelId).then((messages) => {
                    return messages.random();
                });
            });
        });
    }
    getQuoteChannel(message) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.specialChannelService.getSpecialChannel(message.guild.id, SpecialChannelDesignation_1.SpecialChannelDesignation.QUOTE_CHANNEL)
                .then((channel) => {
                return channel.channel_id;
            });
        });
    }
    getAllMessages(message, channelId) {
        return __awaiter(this, void 0, void 0, function* () {
            // @ts-ignore
            const channel = message.guild.channels.resolve(channelId);
            if (channel.messages.cache.size > 0) {
                return channel.messages.cache;
            }
            return this.fetchAllMessages(channel, null);
        });
    }
    fetchAllMessages(channel, beforeMessageId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Fetch the channels.
            return channel.messages.fetch({ limit: 100, before: beforeMessageId }).then((messages) => __awaiter(this, void 0, void 0, function* () {
                if (messages.size < 100) {
                    return messages;
                }
                yield delay(250);
                const oldestMsg = messages.first().id;
                // Go until we get all the messages.
                return this.fetchAllMessages(channel, oldestMsg).then((returnedMessages) => {
                    const concatMessages = messages.concat(returnedMessages);
                    channel.messages.cache = concatMessages;
                    return concatMessages;
                });
            }));
        });
    }
};
QuoteCommandHandler = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.Client)),
    __param(1, inversify_1.inject(types_1.TYPES.SpecialChannelService)),
    __metadata("design:paramtypes", [discord_js_1.Client,
        SpecialChannelService_1.SpecialChannelService])
], QuoteCommandHandler);
exports.QuoteCommandHandler = QuoteCommandHandler;
//# sourceMappingURL=QuoteCommandHandler.js.map