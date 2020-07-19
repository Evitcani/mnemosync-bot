import {AbstractCommandHandler} from "./base/AbstractCommandHandler";
import {Command} from "../models/generic/Command";
import {Message} from "discord.js";
import {Character} from "../models/database/Character";
import {Subcommands} from "../documentation/commands/Subcommands";
import {Subcommand} from "../models/generic/Subcommand";
import {TravelConfig} from "../models/database/TravelConfig";
import {inject} from "inversify";
import {TYPES} from "../types";
import {CharacterService} from "../database/CharacterService";
import {CharacterRelatedClientResponses} from "../documentation/client-responses/CharacterRelatedClientResponses";
import {PartyService} from "../database/PartyService";
import {Party} from "../models/database/Party";

export class CharacterCommandHandler extends AbstractCommandHandler {
    private characterService: CharacterService;
    private partyService: PartyService;

    constructor(@inject(TYPES.CharacterService) characterService: CharacterService,
                @inject(TYPES.PartyService) partyService: PartyService) {
        super();
        this.characterService = characterService;
        this.partyService = partyService;
    }

    async handleCommand(command: Command, message: Message): Promise<Message | Message[]> {
        return this.constructCharacter(command, message).then((character) => {
            if (Subcommands.CREATE.isCommand(command) != null) {
                return this.createCharacter(message, character);
            }
            return undefined;
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
        const nameCmd = CharacterCommandHandler.getNameCmd(command);
        if (nameCmd == null) {
            return null;
        }

        // Construct the character and add the name.
        const character: Character = new class implements Character {
            id: number;
            img_url: string;
            name: string;
            party_id: number;
            travel_config: TravelConfig;
        };
        character.name = nameCmd.getInput();

        // See if we were given a party...
        const ptCmd = Subcommands.PARTY.isCommand(command);
        if (ptCmd != null) {
            return this.partyService.getPartiesInGuildWithName(message.guild.id, ptCmd.getInput())
                .then((parties) => {
                    if (parties == null || parties.length != 0) {
                        console.debug("Found either no parties or too many parties!");
                        return null;
                    }

                    const party: Party = parties[0];
                    character.party_id = party.id;
                });
        }

        return character;
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