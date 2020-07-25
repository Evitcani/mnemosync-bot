import {AbstractUserCommandHandler} from "../../../base/AbstractUserCommandHandler";
import {inject, injectable} from "inversify";
import {Command} from "../../../../models/generic/Command";
import {Message, MessageEmbed} from "discord.js";
import {TYPES} from "../../../../types";
import {User} from "../../../../entity/User";
import {EncryptionUtility} from "../../../../utilities/EncryptionUtility";
import {Subcommands} from "../../../../documentation/commands/Subcommands";
import {Sending} from "../../../../entity/Sending";
import {NPCController} from "../../../../controllers/character/NPCController";
import {World} from "../../../../entity/World";
import {SendingController} from "../../../../controllers/character/SendingController";
import {SendingHelpRelatedResponses} from "../../../../documentation/client-responses/misc/SendingHelpRelatedResponses";
import {WorldController} from "../../../../controllers/world/WorldController";
import {Character} from "../../../../entity/Character";
import {GameDate} from "../../../../entity/GameDate";
import {CharacterController} from "../../../../controllers/character/CharacterController";
import {MessageUtility} from "../../../../utilities/MessageUtility";
import {NonPlayableCharacter} from "../../../../entity/NonPlayableCharacter";
import {StringUtility} from "../../../../utilities/StringUtility";
import {PartyController} from "../../../../controllers/party/PartyController";

/**
 * Handles sending related commands.
 */
@injectable()
export class SendingCommandHandler extends AbstractUserCommandHandler {
    private characterController: CharacterController;
    private readonly encryptionUtility: EncryptionUtility;
    private partyController: PartyController;
    private npcController: NPCController;
    private sendingController: SendingController;
    private worldController: WorldController;

    constructor(@inject(TYPES.CharacterController) characterController: CharacterController,
                @inject(TYPES.EncryptionUtility) encryptionUtility: EncryptionUtility,
                @inject(TYPES.PartyController) partyController: PartyController,
                @inject(TYPES.NPCController) npcController: NPCController,
                @inject(TYPES.SendingController) sendingController: SendingController,
                @inject(TYPES.WorldController) worldController: WorldController) {
        super();
        this.characterController = characterController;
        this.encryptionUtility = encryptionUtility;
        this.partyController = partyController;
        this.npcController = npcController;
        this.sendingController = sendingController;
        this.worldController = worldController;
    }


    async handleUserCommand(command: Command, message: Message, user: User): Promise<Message | Message[]> {
        // Want to view sendings.
        if (command.getSubcommands() == null || command.getSubcommands().size < 1 || Subcommands.GET.isCommand(command)) {
            return this.getUnrepliedSendings(command, user, message);
        }

        // Reading a message.
        if (Subcommands.READ.isCommand(command)) {
            const readCmd = Subcommands.READ.getCommand(command);

            // Get latest message.
            if (readCmd.getInput() == null) {

            }

            // TODO: Figure out how this'll work...
            return null;
        }

        if (Subcommands.REPLY.isCommand(command)) {
            // Someone is replying!
            return this.replyToSending(command, user, message);
        }

        return this.createNewSending(command, message, user);
    }

    /**
     * Creates a new sending from the information given by the command.
     *
     * @param command The command originally sent.
     * @param message Message object of the originating command.
     * @param user The user doing the command.
     */
    private async createNewSending(command: Command, message: Message, user: User): Promise<Message | Message[]> {
        // Go and get the world.
        let world = await this.worldController.worldSelectionFromUser(user, message);

        // If there is no world, then give an automated reply.
        if (world == null) {
            return message.channel.send("No world where this message can be sent!");
        }

        // Construct the sending.
        let sending = await this.constructNewSending(command, user, world, new Sending(), message);

        // Some sort of failure happened.
        if (sending == null) {
            return message.channel.send("Could not send message.");
        }

        // Put the sending in the database.
        const sent = await this.sendingController.create(sending);

        // If could not send, respond in kind.
        if (sent == null) {
            return message.channel.send("Could not send message.");
        }

        // Create embed and notify users.
        let toSend = SendingHelpRelatedResponses.PRINT_MESSAGE_TO_PLAYER(sending, this.encryptionUtility);
        let onComplete = SendingHelpRelatedResponses.PRINT_FINISHED_INFORMING(sending, this.encryptionUtility);
        return this.signalUserOfMessage(sent, message, onComplete, toSend, false, user);
    }

    /**
     * Handles the process of replying to a sending.
     *
     * @param command The command originally sent.
     * @param message Message object of the originating command.
     * @param user The user doing the command.
     */
    private async replyToSending (command: Command, user: User, message: Message): Promise<Message | Message[]> {
        let replyCmd = Subcommands.REPLY.getCommand(command);
        if (replyCmd == null || replyCmd.getInput() == null) {
            return message.channel.send("No reply ID.");
        }

        let page = StringUtility.getNumber(replyCmd.getInput());
        if (page == null) {
            return message.channel.send("ID isn't a number.");
        }

        let arr = await this.getSendingArray(user.defaultWorld, user.defaultCharacter, null, message);

        // If both are null, return a standard message.
        if (arr.world == null && arr.character == null) {
            return message.channel.send(SendingHelpRelatedResponses.NO_DEFAULT_WORLD_OR_CHARACTER());
        }

        let msg = await this.sendingController.getOne(page, arr.world, arr.npc, arr.character);

        // If no message, couldn't find it.
        if (msg == null) {
            return message.channel.send("Could not find message with that ID.");
        }

        // Now get the sending to put in the message.
        let sending = await this.constructNewSending(command, user, null, msg, message);

        // IF null, something went wrong upstream.
        if (sending == null) {
            return null;
        }

        // Get the sending from creating a new one.
        sending = await this.sendingController.create(sending);

        // Now craft the embed and send to users.
        let toSend = SendingHelpRelatedResponses.PRINT_MESSAGE_REPLY_TO_PLAYER(sending, this.encryptionUtility);
        let onComplete = SendingHelpRelatedResponses.PRINT_FINISHED_INFORMING(sending, this.encryptionUtility);
        return this.signalUserOfMessage(sending, message, onComplete, toSend, true, user);
    }

    /**
     * Gets who the message should be retrieved for.
     * @param world
     * @param character
     * @param npc
     * @param message
     */
    private async getSendingArray(world: World, character: Character, npc: NonPlayableCharacter, message: Message): Promise<{world: World,
        character: Character,
        npc: NonPlayableCharacter}> {
        // TODO: Implement for NPC.

        // If both are not null, give user a choice.
        if (world != null && character != null) {
            let ret = await this.worldOrCharacter(world, character, message);

            if (ret == null) {
                return null;
            }

            // Type is world.
            if (WorldController.isWorld(ret)) {
                world = ret;
                character = null;
            } else {
                character = ret;
                world = null;
            }
        }

        return {world: world, character: character, npc: npc};
    }

    /**
     * Signals users of the changes made.
     *
     * @param sending
     * @param message
     * @param completionMessage
     * @param messageToSend
     * @param to
     * @param user
     */
    private async signalUserOfMessage(sending: Sending, message: Message,
                                      completionMessage: MessageEmbed, messageToSend: MessageEmbed,
                                      to: boolean, user: User): Promise<Message | Message[]> {
        // Get discord ids of users to send messages to.
        let discordIds: string[] = [];

        // Are we getting from a player character?
        let playerCharacter = sending.fromPlayerCharacterId;

        // Notify the player of the reply.
        if (playerCharacter != null) {
            discordIds = discordIds.concat(await this.characterController.getDiscordId(playerCharacter));
        }

        // Are we getting from a player character?
        playerCharacter = sending.toPlayerCharacterId;

        // Notify the player of the reply.
        if (playerCharacter != null) {
            discordIds = discordIds.concat(await this.characterController.getDiscordId(playerCharacter));
        }

        // Are we getting from an NPC?
        let npc = (sending.fromNpc != null) ?
            sending.fromNpc :
            ((sending.toNpc != null) ? sending.toNpc : null);

        // From an NPC.
        if (npc != null) {
            discordIds = discordIds.concat(await this.worldController.getDiscordId(npc.worldId));
        }

        // Check for the world.
        let world = sending.worldId;

        // We'll want to inform the GM as well.
        if (world != null) {
            discordIds = discordIds.concat(await this.worldController.getDiscordId(world));
        }

        // Find current user in the list.
        let index = discordIds.indexOf(user.discord_id);

        // Remove the current user from this list.
        if  (index >= 0) {
            discordIds = discordIds.splice(index, 1);
        }

        return MessageUtility.sendPrivateMessages(discordIds, message, completionMessage, messageToSend);
    }

    /**
     * Gets all the unreplied messages.
     *
     * @param command The command originally sent.
     * @param message Message object of the originating command.
     * @param user The user doing the command.
     */
    private async getUnrepliedSendings(command: Command, user: User, message: Message): Promise<Message | Message[]> {
        // Process the next  command.
        let page = MessageUtility.getPage(command);

        let arr = await this.getSendingArray(user.defaultWorld, user.defaultCharacter, null, message);

        // If both are null, return a standard message.
        if (arr.world == null && arr.character == null) {
            return message.channel.send(SendingHelpRelatedResponses.NO_DEFAULT_WORLD_OR_CHARACTER());
        }

        const messages = await this.sendingController.get(page, arr.world, arr.npc, arr.character);
        let embed: MessageEmbed;
        if (arr.character != null) {
            embed = SendingHelpRelatedResponses.PRINT_MESSAGES_TO_CHARACTER(messages, arr.character, page, this.encryptionUtility);
        } else {
            embed = SendingHelpRelatedResponses.PRINT_MESSAGES_FROM_WORLD(messages, arr.world, page, this.encryptionUtility);
        }

        return message.channel.send(embed);
    }

    private async constructNewSending(command: Command, user: User, world: World, sending: Sending, message: Message): Promise<Sending> {
        // Get the content.
        if (Subcommands.MESSAGE.isCommand(command)) {
            const msgCmd = Subcommands.MESSAGE.getCommand(command);
            if (!Subcommands.REPLY.isCommand(command)) {
                sending.content = this.encryptionUtility.encrypt(msgCmd.getInput());
                sending.sendingMessageFromUser = user;
            } else {
                sending.reply = this.encryptionUtility.encrypt(msgCmd.getInput());
                sending.sendingReplyFromUser = user;
                return sending;
            }
        } else {
            await message.channel.send(SendingHelpRelatedResponses.MESSAGE_HAS_NO_CONTENT(message.content));
            return null;
        }

        // Set the world.
        sending.world = world;

        // Get the in-game date.
        if (Subcommands.DATE.isCommand(command)) {
            const dateCmd = Subcommands.DATE.getCommand(command);
            let input = dateCmd.getInput();
            if (input == null) {
                await message.channel.send("There was no actual date given.");
                return null;
            }
            // Split the date and process.
            let dates = input.split("/");
            if (dates.length < 3) {
                await message.channel.send("Date was malformed. Should be like `[day]/[month]/[year]`");
                return null;
            }

            // TODO: Implement era processing.
            let day = StringUtility.getNumber(dates[0]),
                month = StringUtility.getNumber(dates[1]),
                year = StringUtility.getNumber(dates[2]);

            // TODO: Better response here.
            if (day == null || month == null || year == null) {
                await message.channel.send("Date was malformed. Day, month or year was not a number. Should be like " +
                    "`[# day]/[# month]/[# year]`");
                return null;
            }

            // Now put it inside the sending.
            sending.inGameDate = new GameDate();
            sending.inGameDate.day = day;
            sending.inGameDate.month = month;
            sending.inGameDate.year = year;
        } else {
            await message.channel.send(SendingHelpRelatedResponses.MESSAGE_HAS_NO_DATE(message.content));
            return null;
        }

        // If going to an NPC, need to see which one.
        if (Subcommands.TO_NPC.isCommand(command)) {
            const tonCmd = Subcommands.TO_NPC.getCommand(command);
            sending.toNpc = await this.npcController.getByName(tonCmd.getInput(), world.id);

            // Could not find the NPC.
            if (sending.toNpc == null) {
                await message.channel.send("Could not find the given NPC you were trying to send to.");
                return null;
            }
        } else {
            // Message is for another player character.
            if (Subcommands.TO.isCommand(command)) {
                const toCmd = Subcommands.TO.getCommand(command);

                // Get all the parties in this world.
                if (world == null) {
                    return null;
                }

                const parties = await this.partyController.getByWorld(world);
                if (parties == null) {
                    await message.channel.send("No parties exist in world.");
                    return null;
                }

                const characters = await this.characterController.getCharacterByNameInParties(toCmd.getInput(), parties);
                if (characters == null) {
                    await message.channel.send("No characters exist in world with name like: " + toCmd.getInput());
                    return null;
                }

                // TODO: Allow multiselect characters.
                sending.toPlayerCharacter = characters[0];
            } else {
                return null;
            }
        }

        // Get who the message is from.
        if (Subcommands.FROM.isCommand(command)) {
            const fromCmd = Subcommands.FROM.getCommand(command);
            sending.fromNpc = await this.npcController.getByName(fromCmd.getInput(), world.id);
        } else {
            if (user.defaultCharacter != null) {
                sending.fromPlayerCharacter = user.defaultCharacter;
            } else {
                // From no one...
                await message.channel.send("Couldn't figure out who this message was meant to be from!");
                return null;
            }
        }

        return sending;
    }

    public async worldOrCharacter(world: World, character: Character, message: Message): Promise<World | Character> {
        return message.channel.send(SendingHelpRelatedResponses.CHECK_SENDINGS_FOR_WHICH(character, world)).then((msg) => {
            return message.channel.awaitMessages(m => m.author.id === message.author.id, {
                max: 1,
                time: 10e3,
                errors: ['time'],
            }).then((input) => {
                msg.delete({reason: "Removed processing command."});
                let content = input.first().content;
                let choice = Number(content);
                if (isNaN(choice) || choice > 2 || choice < 1) {
                    message.channel.send("Input doesn't make sense!");
                    return null;
                }

                input.first().delete();
                return choice == 1 ? world : character;
            }).catch(()=> {
                msg.delete({reason: "Removed processing command."});
                message.channel.send("Message timed out.");
                return null;
            });
        });
    }
}