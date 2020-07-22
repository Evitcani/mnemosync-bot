import {Command} from "../../../../models/generic/Command";
import {Message} from "discord.js";
import {Character} from "../../../../entity/Character";
import {Subcommands} from "../../../../documentation/commands/Subcommands";
import {Subcommand} from "../../../../models/generic/Subcommand";
import {inject} from "inversify";
import {TYPES} from "../../../../types";
import {CharacterRelatedClientResponses} from "../../../../documentation/client-responses/character/CharacterRelatedClientResponses";
import {PartyController} from "../../../../controllers/party/PartyController";
import {CharacterController} from "../../../../controllers/character/CharacterController";
import {AbstractUserCommandHandler} from "../../../base/AbstractUserCommandHandler";
import {User} from "../../../../entity/User";
import {UserController} from "../../../../controllers/user/UserController";
import {NonPlayableCharacter} from "../../../../entity/NonPlayableCharacter";
import {NPCController} from "../../../../controllers/character/NPCController";
import {WorldController} from "../../../../controllers/world/WorldController";

export class CharacterCommandHandler extends AbstractUserCommandHandler {
    private characterController: CharacterController;
    private npcController: NPCController;
    private partyController: PartyController;
    private userController: UserController;
    private worldController: WorldController;

    constructor(@inject(TYPES.CharacterController) characterController: CharacterController,
                @inject(TYPES.NPCController) npcController: NPCController,
                @inject(TYPES.PartyController) partyController: PartyController,
                @inject(TYPES.UserController) userController: UserController,
                @inject(TYPES.WorldController) worldController: WorldController) {
        super();
        this.characterController = characterController;
        this.npcController = npcController;
        this.partyController = partyController;
        this.userController = userController;
        this.worldController = worldController;
    }

    async handleUserCommand(command, message, user): Promise<Message | Message[]> {
        if (Subcommands.CREATE.isCommand(command) != null) {
            const npcCmd = Subcommands.NPC.isCommand(command);
            if (npcCmd != null) {
                return this.constructNPC(command, message, user).then((npc) => {
                    return this.npcController.create(npc).then((character) => {
                        if (character == null) {
                            return message.channel.send("Could not create new NPC.");
                        }

                        return message.channel.send("Created new NPC: " + character.name);
                    });
                });
            }

            return this.constructCharacter(command, message, user, true).then((character) => {
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

    private async switchCharacter(message: Message, cmd: Subcommand, user: User): Promise<Message | Message[]> {
        return this.characterController.getCharacterByName(cmd.getInput(), message.author.id).then((char) => {
            if (char == null) {
                return message.channel.send(`No character exists with a name like '${cmd.getInput()}'`);
            }

            return this.userController.updateDefaultCharacter(user, char).then(() => {
                return message.channel.send(CharacterRelatedClientResponses.NOW_PLAYING_AS_CHARACTER(char, false));
            });
        });
    }

    private async addNickname(command: Subcommand, message: Message, user: User): Promise<Message | Message[]> {
        if (user == null || user.defaultCharacter == null) {
            return message.channel.send("Unable to add nickname to character. No default character.");
        }
        return this.characterController.createNickname(command.getInput(), user.defaultCharacter, message.author.id)
            .then((nick) => {
                if (nick == null) {
                    return message.channel.send("Unable to add nickname to character.");
                }

                return message.channel.send("Added nickname to character!");
            });
    }

    /**
     * Creates a character.
     *
     * @param message The message object that spurred this command.
     * @param character The character to create.
     * @param user The user
     */
    private async createCharacter(message: Message, character: Character, user: User): Promise<Message | Message[]> {
        if (character == null || character.name == null) {
            return message.channel.send("You must provide a name for the character!");
        }

        return this.characterController.create(character, message.author.id)
            .then((char) => {
                if (char == null) {
                    return message.channel.send("Could not create character.");
                }

                return this.userController.updateDefaultCharacter(user, char).then(() => {
                    return message.channel.send(CharacterRelatedClientResponses.NOW_PLAYING_AS_CHARACTER(character, true));
                });
            });
    }

    private async constructNPC(command: Command, message: Message, user: User): Promise<NonPlayableCharacter> {
        // TODO:  Make more dynamic.
        const character: NonPlayableCharacter = new NonPlayableCharacter();

        const nameCmd = CharacterCommandHandler.getNameCmd(command);
        if (nameCmd != null) {
            character.name = nameCmd.getInput();
        }

        return this.worldController.worldSelectionFromUser(user, message).then((world) => {
            if (world != null) {
                character.world = world;
            }

            return character;
        })
    }

    private async constructCharacter(command: Command, message: Message, user: User, isNew: boolean): Promise<Character> {
        // Construct the character and add the name.
        const character: Character = (isNew || user.defaultCharacter == null) ? new Character() : user.defaultCharacter;

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

                    character.party = parties[0];

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