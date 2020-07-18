import {inject, injectable} from "inversify";
import {AbstractCommandHandler} from "./base/AbstractCommandHandler";
import {Command} from "../models/generic/Command";
import {Client, Collection, Message, Snowflake, TextChannel} from "discord.js";
import {TYPES} from "../types";
import {SpecialChannelService} from "../database/SpecialChannelService";
import {SpecialChannelDesignation} from "../enums/SpecialChannelDesignation";
import {QuoteRelatedClientResponses} from "../documentation/client-responses/QuoteRelatedClientResponses";
import {Bot} from "../bot";

/**
 * Handles the "quote" command from users. This command allows a user to designate a channel as the "quote" channel and
 * then fetch random quotes from it.
 */
@injectable()
export class QuoteCommandHandler extends AbstractCommandHandler {
    /** The bot client. */
    private client: Client;
    /** The service for getting the special channels. */
    private specialChannelService: SpecialChannelService;

    /**
     * Constructs this command handler.
     *
     * @param client The bot's client.
     * @param specialChannelService The special channel service.
     */
    constructor(@inject(TYPES.Client) client: Client,
                @inject(TYPES.SpecialChannelService) specialChannelService: SpecialChannelService,) {
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
    async handleCommand(command: Command, message: Message): Promise<Message | Message[]> {
        // Registering the channel.
        if (command.getInput() != null && command.getInput().toLowerCase() == "here") {
            return this.registerQuoteChannel(message);
        }

        // Otherwise gets a random quote from the quote channel.
        return this.getRandomQuote(message).then((msg) => {
            if (msg == null) {
                return message.channel.send("No quotes channel! Please go into your quotes channel and use the command " +
                    "`" + Bot.PREFIX + "quote here`.");
            }

            return message.channel.send(QuoteRelatedClientResponses.QUOTED_MESSAGE(msg));
        });
    }

    /**
     * Registers the current channel as the quote channel.
     *
     * @param message The message the command originated from.
     */
    private async registerQuoteChannel (message: Message): Promise<Message | Message[]> {
        return this.specialChannelService.addSpecialChannel(message.guild.id, SpecialChannelDesignation.QUOTE_CHANNEL, message.channel.id)
            .then(() => {
                return message.channel.send("Registered this channel as your quotes channel!");
            });
    }

    /**
     * Get a random quote.
     *
     * @param message The message the command originated from.
     */
    private async getRandomQuote (message: Message): Promise<Message> {
        return this.getQuoteChannel(message).then((channelId) => {
            if (channelId == null) {
                return null;
            }

            return this.getAllMessages(message, channelId).then((messages) => {
                if (messages == null) {
                    return null;
                }
                return messages.random();
            });
        });
    }

    /**
     * Gets the channel registered for quotes.
     *
     * @param message The message the command originated from.
     */
    private async getQuoteChannel(message: Message): Promise<string> {
        return this.specialChannelService.getSpecialChannel(message.guild.id, SpecialChannelDesignation.QUOTE_CHANNEL)
            .then((channel) => {
                if (channel == null) {
                    return null;
                }

                return channel.channel_id;
            });
    }

    /**
     * Gets all the messages in the given channel.
     *
     * @param message The message the command originated from.
     * @param channelId The ID of the channel to get all the messages from.
     */
    private async getAllMessages(message: Message, channelId: string): Promise<Collection<Snowflake, Message>> {
        // @ts-ignore
        const channel: TextChannel = message.guild.channels.resolve(channelId);

        if (channel.messages.cache.size > 0) {
            return channel.messages.cache;
        }

        return this.fetchAllMessages(channel, null);
    }

    /**
     * Fetches all the messages.
     *
     * @param channel The channel to fetch all the messages from.
     * @param beforeMessageId The last message ID.
     */
    private async fetchAllMessages(channel: TextChannel, beforeMessageId: Snowflake | null): Promise<Collection<Snowflake, Message>> {
        // Fetch the channels.
        return channel.messages.fetch({limit: 100, before: beforeMessageId}).then(async (messages) => {
            if (messages.size < 100) {
                console.debug("Finished fetching messages.");
                return messages;
            }

            messages.sort(this.sortMessages);

            console.debug("Fetched more messages, pausing....");

            await new Promise(resolve => setTimeout(resolve, 250));

            console.debug("Finished pausing.");

            const oldestMsg = messages.first();
            console.debug("Oldest message timestamp: " + oldestMsg.createdTimestamp);

            // Go until we get all the messages.
            return this.fetchAllMessages(channel, oldestMsg.id).then((returnedMessages) => {
                const concatMessages = messages.concat(returnedMessages);
                channel.messages.cache = concatMessages;
                return concatMessages;
            });
        })
    }

    /**
     * Sorts the messages from oldest to newest.
     *
     * @param firstValue
     * @param secondValue
     * @param firstKey
     * @param secondKey
     */
    private sortMessages (firstValue: Message, secondValue: Message, firstKey: string, secondKey: string): number {
        return firstValue.createdTimestamp - secondValue.createdTimestamp;
    }
}