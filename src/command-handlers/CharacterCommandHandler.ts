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

export class CharacterCommandHandler extends AbstractUserCommandHandler {
    private characterController: CharacterController;
    private partyController: PartyController;
    private userController: UserController;

    constructor(@inject(TYPES.CharacterController) characterController: CharacterController,
                @inject(TYPES.PartyController) partyController: PartyController,
                @inject(TYPES.UserController) userController: UserController) {
        super();
        this.characterController = characterController;
        this.partyController = partyController;
        this.userController = userController;
    }

    async handleUserCommand(command, message, user): Promise<Message | Message[]> {
        return this.constructCharacter(command, message, user).then((character) => {
            if (Subcommands.CREATE.isCommand(command) != null) {
                return this.createCharacter(message, character, user);
            }

            if (Subcommands.SWITCH.isCommand(command) != null) {
                return this.switchCharacter(message, character, user);
            }
            return undefined;
        });
    }

    private async switchCharacter(message: Message, character: Character, user: User): Promise<Message | Message[]> {
        return this.characterController.getCharacterByName(character.name, message.author.id).then((char) => {
            if (char == null) {
                return message.channel.send(`No character exists with a name like '${character.name}'`);
            }

            return this.userController.updateDefaultCharacter(user, char).then(() => {
                return message.channel.send(CharacterRelatedClientResponses.NOW_PLAYING_AS_CHARACTER(char, false));
            });
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

    private async constructCharacter(command: Command, message: Message, user: User): Promise<Character> {
        // Construct the character and add the name.
        const character: Character = user.defaultCharacter == null ? new Character() : user.defaultCharacter;

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