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
var QuoteCommandHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuoteCommandHandler = void 0;
const inversify_1 = require("inversify");
const AbstractCommandHandler_1 = require("../base/AbstractCommandHandler");
const discord_js_1 = require("discord.js");
const types_1 = require("../../types");
const SpecialChannelService_1 = require("../../database/SpecialChannelService");
const SpecialChannelDesignation_1 = require("../../enums/SpecialChannelDesignation");
const QuoteRelatedClientResponses_1 = require("../../documentation/client-responses/misc/QuoteRelatedClientResponses");
const bot_1 = require("../../bot");
/**
 * Handles the "quote" command from users. This command allows a user to designate a channel as the "quote" channel and
 * then fetch random quotes from it.
 */
let QuoteCommandHandler = QuoteCommandHandler_1 = class QuoteCommandHandler extends AbstractCommandHandler_1.AbstractCommandHandler {
    /**
     * Constructs this command handler.
     *
     * @param client The bot's client.
     * @param specialChannelService The special channel service.
     */
    constructor(client, specialChannelService) {
        super();
        this.client = client;
        this.specialChannelService = specialChannelService;
    }
    /**
     * Handles the quote command.
     *
     * @param command The processed command.
     * @param message The message the command originated from.
     */
    handleCommand(command, message) {
        return __awaiter(this, void 0, void 0, function* () {
            // Registering the channel.
            if (command.getInput() != null && command.getInput().toLowerCase() == "here") {
                return this.registerQuoteChannel(message);
            }
            // Otherwise gets a random quote from the quote channel.
            return this.getRandomQuote(message);
        });
    }
    /**
     * Registers the current channel as the quote channel.
     *
     * @param message The message the command originated from.
     */
    registerQuoteChannel(message) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.specialChannelService.addSpecialChannel(message.guild.id, SpecialChannelDesignation_1.SpecialChannelDesignation.QUOTE_CHANNEL, message.channel.id)
                .then(() => {
                return message.channel.send("Registered this channel as your quotes channel!");
            });
        });
    }
    /**
     * Get a random quote.
     *
     * @param message The message the command originated from.
     */
    getRandomQuote(message) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getQuoteChannel(message).then((channelId) => {
                if (channelId == null) {
                    return message.channel.send("No quotes channel! Please go into your quotes channel and use the command " +
                        "`" + bot_1.Bot.PREFIX + "quote here`.");
                }
                return this.getAllMessages(message, channelId).then((messages) => {
                    if (messages == null) {
                        return null;
                    }
                    const msg = messages.random();
                    return QuoteRelatedClientResponses_1.QuoteRelatedClientResponses.QUOTED_MESSAGE(msg, messages.size).then((msg) => {
                        return message.channel.send(msg);
                    });
                });
            });
        });
    }
    /**
     * Gets the channel registered for quotes.
     *
     * @param message The message the command originated from.
     */
    getQuoteChannel(message) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.specialChannelService.getSpecialChannel(message.guild.id, SpecialChannelDesignation_1.SpecialChannelDesignation.QUOTE_CHANNEL)
                .then((channel) => {
                if (channel == null) {
                    return null;
                }
                return channel.channel_id;
            });
        });
    }
    /**
     * Gets all the messages in the given channel.
     *
     * @param message The message the command originated from.
     * @param channelId The ID of the channel to get all the messages from.
     */
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
    /**
     * Fetches all the messages.
     *
     * @param channel The channel to fetch all the messages from.
     * @param beforeMessageId The last message ID.
     */
    fetchAllMessages(channel, beforeMessageId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Fetch the channels.
            return channel.messages.fetch({ limit: 100, before: beforeMessageId }).then((messages) => __awaiter(this, void 0, void 0, function* () {
                if (messages.size < 100) {
                    console.debug("Finished fetching messages.");
                    return messages;
                }
                messages.sort(QuoteCommandHandler_1.sortMessages);
                console.debug("Fetched more messages, pausing....");
                yield new Promise(resolve => setTimeout(resolve, 250));
                console.debug("Finished pausing.");
                const oldestMsg = messages.first();
                console.debug("Oldest message timestamp: " + oldestMsg.createdTimestamp);
                // Go until we get all the messages.
                return this.fetchAllMessages(channel, oldestMsg.id).then((returnedMessages) => {
                    const concatMessages = messages.concat(returnedMessages);
                    channel.messages.cache = concatMessages;
                    return concatMessages;
                });
            }));
        });
    }
    /**
     * Sorts the messages from oldest to newest.
     *
     * @param firstValue
     * @param secondValue
     * @param firstKey
     * @param secondKey
     */
    static sortMessages(firstValue, secondValue, firstKey, secondKey) {
        return firstValue.createdTimestamp - secondValue.createdTimestamp;
    }
};
QuoteCommandHandler = QuoteCommandHandler_1 = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.Client)),
    __param(1, inversify_1.inject(types_1.TYPES.SpecialChannelService)),
    __metadata("design:paramtypes", [discord_js_1.Client,
        SpecialChannelService_1.SpecialChannelService])
], QuoteCommandHandler);
exports.QuoteCommandHandler = QuoteCommandHandler;
//# sourceMappingURL=QuoteCommandHandler.js.map