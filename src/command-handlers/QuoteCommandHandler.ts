import {inject, injectable} from "inversify";
import {AbstractCommandHandler} from "./base/AbstractCommandHandler";
import {Command} from "../models/generic/Command";
import {Client, Collection, Message, Snowflake, TextChannel} from "discord.js";
import {TYPES} from "../types";
import {SpecialChannelService} from "../database/SpecialChannelService";
import {SpecialChannelDesignation} from "../enums/SpecialChannelDesignation";
import {QuoteRelatedClientResponses} from "../documentation/client-responses/QuoteRelatedClientResponses";
const delay = require('delay');

/**
 * Handles the "quote" command from users. This command allows a user to designate a channel as the "quote" channel and
 * then fetch random quotes from it.
 */
@injectable()
export class QuoteCommandHandler extends AbstractCommandHandler {
    private client: Client;
    private specialChannelService: SpecialChannelService;

    constructor(@inject(TYPES.Client) client: Client,
                @inject(TYPES.SpecialChannelService) specialChannelService: SpecialChannelService,) {
        super();
        this.client = client;
        this.specialChannelService = specialChannelService;
    }

    async handleCommand(command: Command, message: Message): Promise<Message | Message[]> {
        // Registering the channel.
        if (command.getInput() != null && command.getInput().toLowerCase() == "here") {
            return this.registerQuoteChannel(message);
        }

        // Otherwise gets a random quote from the quote channel.
        return this.getRandomQuote(message).then((msg) => {
            return message.channel.send(QuoteRelatedClientResponses.QUOTED_MESSAGE(msg));
        });
    }

    private async registerQuoteChannel (message: Message): Promise<Message | Message[]> {
        return this.specialChannelService.addSpecialChannel(message.guild.id, SpecialChannelDesignation.QUOTE_CHANNEL, message.channel.id)
            .then(() => {
                return message.channel.send("Registered this channel as your quotes channel!");
            });
    }

    private async getRandomQuote (message: Message): Promise<Message> {
        return this.getQuoteChannel(message).then((channelId) => {
            return this.getAllMessages(message, channelId).then((messages) => {
                return messages.random();
            });
        });
    }

    private async getQuoteChannel(message: Message): Promise<string> {
        return this.specialChannelService.getSpecialChannel(message.guild.id, SpecialChannelDesignation.QUOTE_CHANNEL)
            .then((channel) => {
                return channel.channel_id;
            });
    }

    private async getAllMessages(message: Message, channelId: string): Promise<Collection<Snowflake, Message>> {
        // @ts-ignore
        const channel: TextChannel = message.guild.channels.resolve(channelId);

        if (channel.messages.cache.size > 0) {
            return channel.messages.cache;
        }

        return this.fetchAllMessages(channel, null);
    }

    private async fetchAllMessages(channel: TextChannel, beforeMessageId: Snowflake | null): Promise<Collection<Snowflake, Message>> {
        // Fetch the channels.
        return channel.messages.fetch({limit: 100, before: beforeMessageId}).then(async (messages) => {
            if (messages.size < 100) {
                return messages;
            }

            await delay(250);

            const oldestMsg = messages.first().id;

            // Go until we get all the messages.
            return this.fetchAllMessages(channel, oldestMsg).then((returnedMessages) => {
                const concatMessages = messages.concat(returnedMessages);
                channel.messages.cache = concatMessages;
                return concatMessages;
            });
        })
    }
}