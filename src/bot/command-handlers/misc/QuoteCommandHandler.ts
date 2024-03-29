import {inject, injectable} from "inversify";
import {AbstractCommandHandler} from "../base/AbstractCommandHandler";
import {Command} from "../../../shared/models/generic/Command";
import {Client, Collection, Message, Snowflake, TextChannel} from "discord.js";
import {TYPES} from "../../../types";
import {QuoteRelatedClientResponses} from "../../../shared/documentation/client-responses/misc/QuoteRelatedClientResponses";
import {Bot} from "../../bot";
import {SpecialChannelController} from "../../../backend/controllers/user/SpecialChannelController";
import {SpecialChannelDTO} from "mnemoshared/dist/src/dto/model/SpecialChannelDTO";
import {DTOType} from "mnemoshared/dist/src/dto/DTOType";
import {SpecialChannelDesignation} from "mnemoshared/dist/src/enums/SpecialChannelDesignation";
import {CharacterRelatedClientResponses} from "../../../shared/documentation/client-responses/character/CharacterRelatedClientResponses";

/**
 * Handles the "quote" command from users. This command allows a user to designate a channel as the "quote" channel and
 * then fetch random quotes from it.
 */
@injectable()
export class QuoteCommandHandler extends AbstractCommandHandler {
    /** The bot client. */
    private client: Client;
    /** The service for getting the special channels. */
    private specialChannelController: SpecialChannelController;

    /**
     * Constructs this command handler.
     *
     * @param client The bot's client.
     * @param specialChannelController
     */
    constructor(@inject(TYPES.Client) client: Client,
                @inject(TYPES.SpecialChannelController) specialChannelController: SpecialChannelController,) {
        super();
        this.client = client;
        this.specialChannelController = specialChannelController;
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
        return this.getRandomQuote(message);
    }

    /**
     * Registers the current channel as the quote channel.
     *
     * @param message The message the command originated from.
     */
    private async registerQuoteChannel (message: Message): Promise<Message | Message[]> {
        let specialChannel: SpecialChannelDTO = {dtoType: DTOType.SPECIAL_CHANNEL};
        specialChannel.channel_id = message.channel.id;
        specialChannel.guild_id = message.guild.id;
        specialChannel.designation = SpecialChannelDesignation.QUOTE_CHANNEL;
        return this.specialChannelController.update(specialChannel)
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
                return message.channel.send("No quotes channel! Please go into your quotes channel and use the command " +
                    "`" + Bot.PREFIX + "quote here`.");
            }

            return this.getAllMessages(message, channelId).then((messages) => {
                if (messages == null) {
                    return null;
                }
                const msg = messages.random();

                return QuoteRelatedClientResponses.QUOTED_MESSAGE(msg, messages.size).then((msg) => {
                    return message.channel.send({ embeds: [msg]});
                });
            });
        });
    }

    /**
     * Gets the channel registered for quotes.
     *
     * @param message The message the command originated from.
     */
    private async getQuoteChannel(message: Message): Promise<string> {
        return this.specialChannelController.getByGuildIdAndDesignation(message.guild.id, SpecialChannelDesignation.QUOTE_CHANNEL)
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

            messages.sort(QuoteCommandHandler.sortMessages);

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
    private static sortMessages (firstValue: Message, secondValue: Message, firstKey: string, secondKey: string): number {
        return firstValue.createdTimestamp - secondValue.createdTimestamp;
    }
}