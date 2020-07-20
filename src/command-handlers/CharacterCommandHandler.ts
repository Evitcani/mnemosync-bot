import {AbstractCommandHandler} from "./base/AbstractCommandHandler";
import {Command} from "../models/generic/Command";
import {Message} from "discord.js";
import {Character} from "../entity/Character";
import {Subcommands} from "../documentation/commands/Subcommands";
import {Subcommand} from "../models/generic/Subcommand";
import {TravelConfig} from "../entity/TravelConfig";
import {inject} from "inversify";
import {TYPES} from "../types";
import {CharacterService} from "../database/CharacterService";
import {CharacterRelatedClientResponses} from "../documentation/client-responses/CharacterRelatedClientResponses";
import {PartyService} from "../database/PartyService";
import {Party} from "../entity/Party";
import {UserService} from "../database/UserService";

export class CharacterCommandHandler extends AbstractCommandHandler {
    private characterService: CharacterService;
    private partyService: PartyService;
    private userService: UserService;

    constructor(@inject(TYPES.CharacterService) characterService: CharacterService,
                @inject(TYPES.PartyService) partyService: PartyService,
                @inject(TYPES.UserService) userService: UserService) {
        super();
        this.characterService = characterService;
        this.partyService = partyService;
        this.userService = userService;
    }

    async handleCommand(command: Command, message: Message): Promise<Message | Message[]> {
        return this.constructCharacter(command, message).then((character) => {
            if (Subcommands.CREATE.isCommand(command) != null) {
                return this.createCharacter(message, character);
            }

            if (Subcommands.SWITCH.isCommand(command) != null) {
                return this.switchCharacter(message, character);
            }
            return undefined;
        });
    }

    private async switchCharacter(message: Message, character: Character): Promise<Message | Message[]> {
        return this.characterService.getCharacterByName(message.author.id, character.name).then((char) => {
            if (char == null) {
                return message.channel.send(`No character exists with a name like '${character.name}'`);
            }

            return this.userService.updateDefaultCharacter(message.author.id, message.author.username, char).then(() => {
                return message.channel.send(CharacterRelatedClientResponses.NOW_PLAYING_AS_CHARACTER(char, false));
            });
        });
    }

    /**
     * Creates a character.
     *
     * @param message
     * @param character The character to create.
     */
    private async createCharacter(message: Message, character: Character): Promise<Message | Message[]> {
        if (character == null || character.name == null) {
            return message.channel.send("You must provide a name for the character!");
        }

        return this.characterService.createCharacter(character, message.author.id, message.author.username)
            .then((character) => {
                return message.channel.send(CharacterRelatedClientResponses.NOW_PLAYING_AS_CHARACTER(character, true));
            });
    }

    private async constructCharacter(command: Command, message: Message): Promise<Character> {
        // Construct the character and add the name.
        const character: Character = new Character();

        // Set the image URL.
        const imgCmd = Subcommands.IMG_URL.isCommand(command);
        if (imgCmd != null) {
            character.img_url = imgCmd.getInput();
        }

        // Set the character name
        const nameCmd = CharacterCommandHandler.getNameCmd(command);
        if (nameCmd != null) {
            character.name = nameCmd.getInput();
        } else {
            // Get this user's default character.
            return this.characterService.getUserWithCharacter(message.author.id, message.author.username).then((user) => {
                if (user == null || user.defaultCharacterId) {
                    return null;
                }
                character.id = user.defaultCharacterId;
                return this.getOtherValues(command, message, character);
            })
        }
        return this.getOtherValues(command, message, character);
    }

    private getOtherValues (command: Command, message: Message, character: Character): Promise<Character> {
        // See if we were given a party...
        const ptCmd = Subcommands.PARTY.isCommand(command);
        if (ptCmd != null) {
            return this.partyService.getPartiesInGuildWithName(message.guild.id, ptCmd.getInput())
                .then((parties) => {
                    if (parties == null || parties.length != 1) {
                        console.debug("Found either no parties or too many parties!");
                        return null;
                    }

                    const party: Party = parties[0];
                    character.party = party;

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