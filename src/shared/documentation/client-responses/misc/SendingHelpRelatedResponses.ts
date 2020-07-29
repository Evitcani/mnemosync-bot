import {MessageEmbed} from "discord.js";
import {BasicEmbed} from "../../BasicEmbed";
import {Bot} from "../../../../bot/bot";
import {Subcommands} from "../../commands/Subcommands";
import {Character} from "../../../../backend/entity/Character";
import {World} from "../../../../backend/entity/World";
import {Sending} from "../../../../backend/entity/Sending";
import {SendingController} from "../../../../backend/controllers/character/SendingController";
import {EncryptionUtility} from "../../../../backend/utilities/EncryptionUtility";

/**
 * Helps the sending command if something went wrong.
 */
export class SendingHelpRelatedResponses {
    /**
     * Message to show if the sending has no date.
     *
     * @param messageContents Original contents of the message.
     */
    static MESSAGE_HAS_NO_DATE(messageContents: string): MessageEmbed {
        return BasicEmbed.get()
            .setTitle(`Message has no date!`)
            .setDescription(`Message has no date. Add message (in-game) date with ` +
                `\`${Bot.PREFIX_SUBCOMMAND}${Subcommands.DATE.name} [day]/[month]/[year]\`.\n\n` +
                `Here is your original message with the added date parameter:\n` +
                `\`\`\`${messageContents} ${Bot.PREFIX_SUBCOMMAND}${Subcommands.DATE.name} [day]/[month]/[year]\`\`\``)
    }

    static MESSAGE_HAS_NO_CONTENT(messageContents: string): MessageEmbed {
        return BasicEmbed.get()
            .setTitle(`Message has no contents!`)
            .setDescription(`Message has no content. Add message content with ` +
                `\`${Bot.PREFIX_SUBCOMMAND}${Subcommands.MESSAGE.name} [message contents]\`.\n\n` +
                `Here is your original message with the added message parameter:\n` +
                `\`\`\`${messageContents} ${Bot.PREFIX_SUBCOMMAND}${Subcommands.MESSAGE.name} [message contents]\`\`\``)
    }

    static CHECK_SENDINGS_FOR_WHICH (character: Character, world: World): MessageEmbed {
        return BasicEmbed.get()
            .setTitle("Choose the which you'd like to see messages for.")
            .setDescription(`Reply with the given number to decide which you'd like to sendings for.\n` +
                `[\`1\`] (\`World    \`) ${world.name}\n` +
                `[\`2\`] (\`Character\`) ${character.name}\n`);
    }

    static NO_DEFAULT_WORLD_OR_CHARACTER (): MessageEmbed {
        return BasicEmbed.get()
            .setTitle("You have no default world or character.")
            .setDescription("Can't fetch messages for no one or nothing!");
    }

    static PRINT_MESSAGES_FROM_WORLD (messages: Sending[], world: World, page: number, encryptionUtility: EncryptionUtility): MessageEmbed {
        let messageStr = this.processMessages(messages, page, true, true, false, encryptionUtility);
        return BasicEmbed.get()
            .setTitle(`Unreplied Messages Sent to NPCs in ${world.name}`)
            .setDescription(`Here are the messages sent to NPCs in this world:\n\n${messageStr}`)
            .setFooter(BasicEmbed.getPageFooter(page, SendingController.SENDING_LIMIT, (messages == null? 0 : messages.length)));
    }

    static PRINT_MESSAGES_TO_CHARACTER (messages: Sending[], character: Character, page: number, encryptionUtility: EncryptionUtility): MessageEmbed {
        let messageStr = this.processMessages(messages, page, false, true, false, encryptionUtility);
        return BasicEmbed.get()
            .setTitle(`Unreplied Messages Sent to ${character.name}`)
            .setDescription(`Here are the messages sent to you:\n\n${messageStr}`)
            .setFooter(BasicEmbed.getPageFooter(page, SendingController.SENDING_LIMIT, (messages == null? 0 : messages.length)));
    }

    static PRINT_MESSAGE_REPLY_TO_PLAYER (message: Sending, encryptionUtility: EncryptionUtility): MessageEmbed {
        let messageStr = this.processMessage(message, 0, true, true, true, encryptionUtility);
        return BasicEmbed.get()
            .setTitle(`Got a message reply!`)
            .setDescription(`Here is the reply:\n\n${messageStr}`);
    }

    static PRINT_MESSAGE_TO_PLAYER (message: Sending, encryptionUtility: EncryptionUtility): MessageEmbed {
        let messageStr = this.processMessage(message, 0, true, true, true, encryptionUtility);
        return BasicEmbed.get()
            .setTitle(`Got a new message!`)
            .setDescription(`You can see your unreplied sendings by typing \`$sending\`.\n\n` +
                `Here is the message:\n\n${messageStr}`);
    }

    static PRINT_FINISHED_INFORMING (message: Sending, encryptionUtility: EncryptionUtility): MessageEmbed {
        let messageStr = this.processMessage(message, 0, true, true, true, encryptionUtility);
        return BasicEmbed.get()
            .setTitle(`Finished informing all users of the reply.`)
            .setDescription(`Here is the message you just sent:\n\n${messageStr}`);
    }

    private static processMessages(messages: Sending[], page: number, includeTo: boolean, includeFrom: boolean, includeReply: boolean, encryptionUtility: EncryptionUtility): string {
        if (!messages || messages.length < 1) {
            return "No messages!";
        }

        let additional = page * SendingController.SENDING_LIMIT;
        let str = "";
        let i, message: Sending;
        for (i = 0; i < messages.length; i++) {
            message = messages[i];
            str += this.processMessage(message, additional + i, includeTo, includeFrom, includeReply, encryptionUtility);
        }

        return str;
    }

    private static processMessage(message: Sending, location: number, includeTo: boolean, includeFrom: boolean, includeReply: boolean, encryptionUtility: EncryptionUtility): string {
        let str = "";
        str += `**[${location}] DATE: ${message.inGameDate.day}/${message.inGameDate.month}/${message.inGameDate.year}**\n`;
        if (includeFrom) {
            str += `> **FROM:** ${message.fromPlayerCharacter != null ? message.fromPlayerCharacter.name : message.fromNpc.name} `;
            str += `(*${message.sendingMessageFromUser.discord_name}*)\n`;
            str += `> ${encryptionUtility.decrypt(message.content)}\n\n`;
        }
        if (includeTo) {
            str += `> **TO  :** ${message.toPlayerCharacter != null ? message.toPlayerCharacter.name : message.toNpc.name}`;
            if (includeReply && message.reply != null) {
                str += `(*${message.sendingReplyFromUser.discord_name}*)\n`;
                str += `> ${encryptionUtility.decrypt(message.reply)}\n`;
            } else {
                str += `\n`;
            }
        }

        str += `\n`;

        return str;
    }
}