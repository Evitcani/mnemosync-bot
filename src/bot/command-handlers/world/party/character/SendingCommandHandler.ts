import {AbstractUserCommandHandler} from "../../../base/AbstractUserCommandHandler";
import {inject, injectable} from "inversify";
import {Command} from "../../../../../shared/models/generic/Command";
import {Collection, Message, MessageEmbed} from "discord.js";
import {TYPES} from "../../../../../types";
import {EncryptionUtility} from "../../../../../backend/utilities/EncryptionUtility";
import {Subcommands} from "../../../../../shared/documentation/commands/Subcommands";
import {SendingController} from "../../../../../backend/controllers/character/SendingController";
import {SendingHelpRelatedResponses} from "../../../../../shared/documentation/client-responses/misc/SendingHelpRelatedResponses";
import {WorldController} from "../../../../../backend/controllers/world/WorldController";
import {CharacterController} from "../../../../../backend/controllers/character/CharacterController";
import {MessageUtility} from "../../../../../backend/utilities/MessageUtility";
import {StringUtility} from "../../../../../backend/utilities/StringUtility";
import {PartyController} from "../../../../../backend/controllers/party/PartyController";
import {UserDTO} from "../../../../../backend/api/dto/model/UserDTO";
import {DTOType} from "../../../../../backend/api/dto/DTOType";
import {WorldDTO} from "../../../../../backend/api/dto/model/WorldDTO";
import {CharacterDTO} from "../../../../../backend/api/dto/model/CharacterDTO";
import {SendingDTO} from "../../../../../backend/api/dto/model/SendingDTO";

/**
 * Handles sending related commands.
 */
@injectable()
export class SendingCommandHandler extends AbstractUserCommandHandler {
    private characterController: CharacterController;
    private readonly encryptionUtility: EncryptionUtility;
    private partyController: PartyController;
    private sendingController: SendingController;
    private worldController: WorldController;

    constructor(@inject(TYPES.CharacterController) characterController: CharacterController,
                @inject(TYPES.EncryptionUtility) encryptionUtility: EncryptionUtility,
                @inject(TYPES.PartyController) partyController: PartyController,
                @inject(TYPES.SendingController) sendingController: SendingController,
                @inject(TYPES.WorldController) worldController: WorldController) {
        super();
        this.characterController = characterController;
        this.encryptionUtility = encryptionUtility;
        this.partyController = partyController;
        this.sendingController = sendingController;
        this.worldController = worldController;
    }


    async handleUserCommand(command: Command, message: Message, user: UserDTO): Promise<Message | Message[]> {
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
    private async createNewSending(command: Command, message: Message, user: UserDTO): Promise<Message | Message[]> {
        // Go and get the world.
        let world = await this.worldController.worldSelectionFromUser(user, message);

        // If there is no world, then give an automated reply.
        if (world == null) {
            return message.channel.send("No world where this message can be sent!");
        }

        // Construct the sending.
        let sending = await this.constructNewSending(command, user, world, {dtoType: DTOType.SENDING}, message);

        // Some sort of failure happened.
        if (sending == null) {
            return message.channel.send("Could not send message.");
        }

        // Put the sending in the database.
        const sent = await this.sendingController.save(sending);

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
    private async replyToSending (command: Command, user: UserDTO, message: Message): Promise<Message | Message[]> {
        let replyCmd = Subcommands.REPLY.getCommand(command);
        if (replyCmd == null || replyCmd.getInput() == null) {
            return message.channel.send("No reply ID.");
        }

        let page = StringUtility.getNumber(replyCmd.getInput());
        if (page == null) {
            return message.channel.send("ID isn't a number.");
        }

        let arr = await this.getSendingArray(user.defaultWorldId, user.defaultCharacterId, message);

        // If both are null, return a standard message.
        if (arr.world == null && arr.character == null) {
            return message.channel.send(SendingHelpRelatedResponses.NO_DEFAULT_WORLD_OR_CHARACTER());
        }

        let msg = await this.sendingController.getOne(page, arr.world.id, arr.character.id);

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
        sending = await this.sendingController.save(sending);

        // Now craft the embed and send to users.
        let toSend = SendingHelpRelatedResponses.PRINT_MESSAGE_REPLY_TO_PLAYER(sending, this.encryptionUtility);
        let onComplete = SendingHelpRelatedResponses.PRINT_FINISHED_INFORMING(sending, this.encryptionUtility);
        return this.signalUserOfMessage(sending, message, onComplete, toSend, true, user);
    }

    /**
     * Gets who the message should be retrieved for.
     * @param worldId
     * @param characterId
     * @param message
     */
    private async getSendingArray(worldId: string, characterId: string, message: Message): Promise<{world: WorldDTO,
        character: CharacterDTO}> {
        let world: WorldDTO = null;
        if (worldId != null) {
            world = await this.worldController.getById(worldId);
        }

        let character: CharacterDTO = null;
        if (characterId != null) {
            character = await this.characterController.getById(characterId);
        }

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

        return {world: world, character: character};
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
    private async signalUserOfMessage(sending: SendingDTO, message: Message,
                                      completionMessage: MessageEmbed, messageToSend: MessageEmbed,
                                      to: boolean, user: UserDTO): Promise<Message | Message[]> {
        // Get discord ids of users to send messages to.
        let discordIds: Collection<string, string> = new Collection<string, string>();

        // Are we getting from a player character?
        let playerCharacter = sending.fromCharacterId;

        // Notify the player of the reply.
        if (playerCharacter != null) {
            discordIds = discordIds.concat(await this.characterController.getDiscordId(playerCharacter));
        }

        // Are we getting from a player character?
        playerCharacter = sending.toCharacterId;

        // Notify the player of the reply.
        if (playerCharacter != null) {
            discordIds = discordIds.concat(await this.characterController.getDiscordId(playerCharacter));
        }

        // Check for the world.
        let world = sending.worldId;

        // We'll want to inform the GM as well.
        if (world != null) {
            discordIds = discordIds.concat(await this.worldController.getDiscordId(world));
        }

        // Remove the current user.
        discordIds.delete(user.discord_id);

        return MessageUtility.sendPrivateMessages(discordIds.array(), message, completionMessage, messageToSend);
    }

    /**
     * Gets all the unreplied messages.
     *
     * @param command The command originally sent.
     * @param message Message object of the originating command.
     * @param user The user doing the command.
     */
    private async getUnrepliedSendings(command: Command, user: UserDTO, message: Message): Promise<Message | Message[]> {
        // Process the next  command.
        let page = MessageUtility.getPage(command);

        let arr = await this.getSendingArray(user.defaultWorldId, user.defaultCharacterId, null);

        // If both are null, return a standard message.
        if (arr.world == null && arr.character == null) {
            return message.channel.send(SendingHelpRelatedResponses.NO_DEFAULT_WORLD_OR_CHARACTER());
        }

        const messages = await this.sendingController.getAllOf(page, arr.world.id, arr.character.id);
        let embed: MessageEmbed;
        if (arr.character != null) {
            embed = SendingHelpRelatedResponses.PRINT_MESSAGES_TO_CHARACTER(messages, arr.character, page, this.encryptionUtility);
        } else {
            embed = SendingHelpRelatedResponses.PRINT_MESSAGES_FROM_WORLD(messages, arr.world, page, this.encryptionUtility);
        }

        return message.channel.send(embed);
    }

    private async constructNewSending(command: Command, user: UserDTO, world: WorldDTO,
                                      sending: SendingDTO, message: Message): Promise<SendingDTO> {
        // Get the content.
        if (Subcommands.MESSAGE.isCommand(command)) {
            const msgCmd = Subcommands.MESSAGE.getCommand(command);
            if (!Subcommands.REPLY.isCommand(command)) {
                sending.content = this.encryptionUtility.encrypt(msgCmd.getInput());
                sending.sendingMessageFromDiscordId = user.discord_id;
            } else {
                sending.reply = this.encryptionUtility.encrypt(msgCmd.getInput());
                sending.sendingReplyFromDiscordId = user.discord_id;
                return sending;
            }
        } else {
            await message.channel.send(SendingHelpRelatedResponses.MESSAGE_HAS_NO_CONTENT(message.content));
            return null;
        }

        // Set the world.
        if (world != null) {
            sending.worldId = world.id;
        }

        // Get the in-game date.
        if (Subcommands.DATE.isCommand(command)) {
            sending.inGameDate = await MessageUtility.processDateCommand(command, message);
        } else {
            await message.channel.send(SendingHelpRelatedResponses.MESSAGE_HAS_NO_DATE(message.content));
            return null;
        }

        // If going to an NPC, need to see which one.
        if (Subcommands.TO_NPC.isCommand(command)) {
            const tonCmd = Subcommands.TO_NPC.getCommand(command);
            let toCharacters = await this.characterController.getNPCByNameAndWorld(tonCmd.getInput(), world.id);

            // Could not find the NPC.
            if (!toCharacters || toCharacters.length <= 0) {
                await message.channel.send("Could not find the given NPC you were trying to send to.");
                return null;
            }

            let toCharacter: CharacterDTO;
            if (toCharacters.length > 1) {
                toCharacter = await this.characterController.selectCharacter(toCharacters, "send message to", message);
                if (toCharacter == null) {
                    return null;
                }
            } else {
                toCharacter = toCharacters[0];
            }

            sending.toCharacterId = toCharacter.id;
        } else {
            // Message is for another player character.
            if (Subcommands.TO.isCommand(command)) {
                const toCmd = Subcommands.TO.getCommand(command);

                // Get all the parties in this world.
                if (world == null) {
                    return Promise.resolve(null);
                }

                const characters = await this.characterController.getCharacterByName(toCmd.getInput(), world.id);
                if (characters == null) {
                    await message.channel.send("No characters exist in world with name like: " + toCmd.getInput());
                    return Promise.resolve(null);
                }

                let character: CharacterDTO;
                if (characters.length > 1) {
                    character = await this.characterController.selectCharacter(characters, "send message to", message);
                    if (character == null) {
                        return null;
                    }
                } else {
                    character = characters[0];
                }

                sending.toCharacterId = character.id;
            } else {
                return Promise.resolve(null);
            }
        }

        // Get who the message is from.
        if (Subcommands.FROM.isCommand(command)) {
            const fromCmd = Subcommands.FROM.getCommand(command);
            let fromCharacters = await this.characterController.getNPCByNameAndWorld(fromCmd.getInput(), world.id);
            if (!fromCharacters || fromCharacters.length <= 0) {
                await message.channel.send("Couldn't figure out who this message was meant to be from!");
                return Promise.resolve(null);
            }

            let fromCharacter: CharacterDTO;
            if (fromCharacters.length > 1) {
                fromCharacter = await this.characterController.selectCharacter(fromCharacters, "send message to", message);
                if (fromCharacter == null) {
                    return null;
                }
            } else {
                fromCharacter = fromCharacters[0];
            }

            sending.fromCharacterId = fromCharacter.id;
        } else {
            if (user.defaultCharacterId != null) {
                sending.fromCharacterId = user.defaultCharacterId;
            } else {
                // From no one...
                await message.channel.send("Couldn't figure out who this message was meant to be from!");
                return Promise.resolve(null);
            }
        }

        return sending;
    }

    public async worldOrCharacter(world: WorldDTO, character: CharacterDTO, message: Message): Promise<WorldDTO | CharacterDTO> {
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