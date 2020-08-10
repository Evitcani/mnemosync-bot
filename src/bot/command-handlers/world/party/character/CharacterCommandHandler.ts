import {Command} from "../../../../../shared/models/generic/Command";
import {Message} from "discord.js";
import {Subcommands} from "../../../../../shared/documentation/commands/Subcommands";
import {Subcommand} from "../../../../../shared/models/generic/Subcommand";
import {inject} from "inversify";
import {TYPES} from "../../../../../types";
import {CharacterRelatedClientResponses} from "../../../../../shared/documentation/client-responses/character/CharacterRelatedClientResponses";
import {PartyController} from "../../../../../backend/controllers/party/PartyController";
import {CharacterController} from "../../../../../backend/controllers/character/CharacterController";
import {AbstractUserCommandHandler} from "../../../base/AbstractUserCommandHandler";
import {UserController} from "../../../../../backend/controllers/user/UserController";
import {WorldController} from "../../../../../backend/controllers/world/WorldController";
import {messageResponse} from "../../../../../shared/documentation/messages/MessageResponse";
import {CharacterDTO} from "mnemoshared/dist/src/dto/model/CharacterDTO";
import {DTOType} from "mnemoshared/dist/src/dto/DTOType";
import {UserDTO} from "mnemoshared/dist/src/dto/model/UserDTO";

/**
 * Handles commands related to characters.
 */
export class CharacterCommandHandler extends AbstractUserCommandHandler {
    /** The controller to communicate to the backend about the character. */
    private characterController: CharacterController;
    /** Command related to parties. */
    private partyController: PartyController;
    private userController: UserController;
    private worldController: WorldController;

    constructor(@inject(TYPES.CharacterController) characterController: CharacterController,
                @inject(TYPES.PartyController) partyController: PartyController,
                @inject(TYPES.UserController) userController: UserController,
                @inject(TYPES.WorldController) worldController: WorldController) {
        super();
        this.characterController = characterController;
        this.partyController = partyController;
        this.userController = userController;
        this.worldController = worldController;
    }

    async handleUserCommand(command, message, user): Promise<Message | Message[]> {
        if (Subcommands.CREATE.isCommand(command)) {
            let character: CharacterDTO;
            if (Subcommands.NPC.isCommand(command)) {
                let world = await this.worldController.worldSelectionFromUser(user, message);
                if (!world) {
                    return null;
                }
                character = {
                    dtoType: DTOType.CHARACTER,
                    isNpc: true,
                    worldId: world.id,
                };
            } else {
                character = user.defaultCharacter == null ?
                    {dtoType: DTOType.CHARACTER, isNpc: false} : user.defaultCharacter;
            }

            return this.constructCharacter(command, message, character).then((character) => {
                return this.createCharacter(message, character, user);
            });
        }

        // Switches the character over.
        if (Subcommands.SWITCH.isCommand(command)) {
            const switchCmd = Subcommands.SWITCH.getCommand(command);
            return this.switchCharacter(message, switchCmd, user);
        }

        // Nickname adding to the character.
        if (Subcommands.NICKNAME.isCommand(command)) {
            const nickCmd = Subcommands.NICKNAME.getCommand(command);
            return this.addNickname(nickCmd, message, user);
        }
        return undefined;
    }

    /**
     * Switches the character.
     *
     * @param message
     * @param cmd
     * @param user
     */
    private async switchCharacter(message: Message, cmd: Subcommand, user: UserDTO): Promise<Message | Message[]> {
        // Go out and get the character.
        let characters: CharacterDTO[] = await this.characterController.getCharacterByName(cmd.getInput(), message.author.id);

        // Couldn't find character.
        if (characters == null || characters.length < 1) {
            return message.channel.send(`No character exists with a name like '${cmd.getInput()}'`);
        }

        let char: CharacterDTO;
        if (characters.length > 1) {
            char = await this.characterController.selectCharacter(characters,
                messageResponse.generic.action.switch_to, message);
            if (char == null) {
                return null;
            }
        } else {
            char = characters[0];
        }

        // Update the default character.
        await this.userController.updateDefaultCharacter(user, char);

        // Return message.
        return message.channel.send(CharacterRelatedClientResponses.NOW_PLAYING_AS_CHARACTER(char, false));
    }

    private async addNickname(command: Subcommand, message: Message, user: UserDTO): Promise<Message | Message[]> {
        if (user == null || user.defaultCharacterId == null) {
            return message.channel.send("Unable to add nickname to character. No default character.");
        }

        let nick = await this.characterController.createNickname(command.getInput(), user.defaultCharacterId, message.author.id);

        if (nick == null) {
            return message.channel.send("Unable to add nickname to character.");
        }

        return message.channel.send("Added nickname to character!");
    }

    /**
     * Creates a character.
     *
     * @param message The message object that spurred this command.
     * @param character The character to create.
     * @param user The user
     */
    private async createCharacter(message: Message, character: CharacterDTO, user: UserDTO): Promise<Message | Message[]> {
        if (character == null || character.name == null) {
            return message.channel.send("You must provide a name for the character!");
        }

        return this.characterController.create(character, message.author.id)
            .then((char) => {
                if (char == null) {
                    return message.channel.send("Could not create character.");
                }

                if (char.isNpc) {
                    return message.channel.send("Created new NPC.");
                }

                return this.userController.updateDefaultCharacter(user, char).then(() => {
                    return message.channel.send(CharacterRelatedClientResponses.NOW_PLAYING_AS_CHARACTER(character, true));
                });
            });
    }

    private async constructCharacter(command: Command, message: Message, character: CharacterDTO): Promise<CharacterDTO> {
        // Set the image URL.
        if (Subcommands.IMG_URL.isCommand(command)) {
            const imgCmd = Subcommands.IMG_URL.getCommand(command);
            character.img_url = imgCmd.getInput();
        }

        // Set the character name
        const nameCmd = CharacterCommandHandler.getNameCmd(command);
        if (nameCmd != null) {
            character.name = nameCmd.getInput();
        }

        // Get the party if there is one.
        if (Subcommands.PARTY.isCommand(command)) {
            const ptCmd = Subcommands.PARTY.getCommand(command);
            return this.partyController.getByNameAndGuild(ptCmd.getInput(), message.guild.id)
                .then((parties) => {
                    if (parties == null || parties.length != 1) {
                        console.debug("Found either no parties or too many parties!");
                        return null;
                    }

                    character.partyId = parties[0].id;

                    return character;
                });
        }

        return Promise.resolve(character);
    }

    /**
     * Gets the command containing the name of the character.
     *
     * @param command The command that may contain the name.
     */
    private static getNameCmd(command: Command): Subcommand {
        if (Subcommands.CREATE.isCommand(command)) {
            return Subcommands.CREATE.getCommand(command);
        }

        if (Subcommands.UPDATE.isCommand(command)) {
            return Subcommands.UPDATE.getCommand(command);
        }

        if (Subcommands.SWITCH.isCommand(command)) {
            return Subcommands.SWITCH.getCommand(command);
        }

        return null;
    }
}