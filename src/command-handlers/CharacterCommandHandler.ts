import {Command} from "../models/generic/Command";
import {Message} from "discord.js";
import {Character} from "../entity/Character";
import {Subcommands} from "../documentation/commands/Subcommands";
import {Subcommand} from "../models/generic/Subcommand";
import {inject} from "inversify";
import {TYPES} from "../types";
import {CharacterRelatedClientResponses} from "../documentation/client-responses/CharacterRelatedClientResponses";
import {PartyController} from "../controllers/PartyController";
import {CharacterController} from "../controllers/CharacterController";
import {AbstractUserCommandHandler} from "./base/AbstractUserCommandHandler";
import {User} from "../entity/User";
import {UserController} from "../controllers/UserController";
import {NonPlayableCharacter} from "../entity/NonPlayableCharacter";
import {NPCController} from "../controllers/NPCController";
import {World} from "../entity/World";
import {WorldController} from "../controllers/WorldController";

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

        const switchCmd = Subcommands.SWITCH.isCommand(command);
        if (switchCmd != null) {
            return this.switchCharacter(message, switchCmd, user);
        }

        const nickCmd = Subcommands.NICKNAME.isCommand(command);
        if (nickCmd != null) {
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

        // If the default world is not null, then add the character on that world.
        let worlds: World[] = [];
        if (user.defaultWorld != null) {
            worlds.push(user.defaultWorld);
        }

        if (user.defaultCharacter != null && user.defaultCharacter.party != null && user.defaultCharacter.party.world != null) {
            worlds.push(user.defaultCharacter.party.world);
        }

        if (worlds.length < 1) {
            await message.channel.send("No world to choose from!");
            return Promise.resolve(null);
        }

        // No selection needed.
        if (worlds.length == 1) {
            character.world = worlds[0];
            return Promise.resolve(character);
        }

        return this.worldController.worldSelection(worlds, message).then((world) => {
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
        const imgCmd = Subcommands.IMG_URL.isCommand(command);
        if (imgCmd != null) {
            character.img_url = imgCmd.getInput();
        }

        // Set the character name
        const nameCmd = CharacterCommandHandler.getNameCmd(command);
        if (nameCmd != null) {
            character.name = nameCmd.getInput();
        }
        return this.getOtherValues(command, message, character);
    }

    private getOtherValues (command: Command, message: Message, character: Character): Promise<Character> {
        // See if we were given a party...
        const ptCmd = Subcommands.PARTY.isCommand(command);
        if (ptCmd != null) {
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

    private static getNameCmd(command: Command): Subcommand {
        let nameCmd: Subcommand = Subcommands.CREATE.isCommand(command);
        if (nameCmd != null) {
            return nameCmd;
        }

        nameCmd = Subcommands.UPDATE.isCommand(command);
        if (nameCmd != null) {
            return nameCmd;
        }

        nameCmd = Subcommands.SWITCH.isCommand(command);
        if (nameCmd != null) {
            return nameCmd;
        }

        return null;
    }
}