import {injectable} from "inversify";
import {Subcommands} from "../../../shared/documentation/commands/Subcommands";
import {Command} from "../../../shared/models/generic/Command";
import {Message} from "discord.js";
import {PartyRelatedClientResponses} from "../../../shared/documentation/client-responses/information/PartyRelatedClientResponses";
import {API} from "../base/API";
import {APIConfig} from "../base/APIConfig";
import {DTOType} from "mnemoshared/dist/src/dto/DTOType";
import {PartyDTO} from "mnemoshared/dist/src/dto/model/PartyDTO";
import {DataDTO} from "mnemoshared/dist/src/dto/model/DataDTO";
import {UserDTO} from "mnemoshared/dist/src/dto/model/UserDTO";
import {PartyQuery} from "mnemoshared/dist/src/models/queries/PartyQuery";
import {WorldRelatedClientResponses} from "../../../shared/documentation/client-responses/information/WorldRelatedClientResponses";

@injectable()
export class PartyController extends API<PartyDTO> {
    constructor() {
        super(APIConfig.GET());
    }

    /**
     * Creates a new party in the server with the given name.
     *
     * @param partyName The name of the party.
     * @param guildId The ID of the guild for this party to live in.
     * @param discordId The discord id of the creator.
     */
    public createNew(partyName: string, guildId: string, discordId: string): Promise<PartyDTO> {
        const party: PartyDTO = {dtoType: DTOType.PARTY};
        party.name = partyName;
        party.guildId = guildId;
        party.creatorDiscordId = discordId;

        let config = APIConfig.GET();
        let data: DataDTO = {};
        data.data = [];
        data.data.push(party);
        config.data = data;

        return this.post(`/parties`, config).then((res) => {
            // @ts-ignore
            return res.data.data;
        }).catch((err: Error) => {
            console.log("Caught error trying to create new party.");
            console.error(err);
            return null;
        });
    }

    public save (party: PartyDTO): Promise<PartyDTO> {
        let config = APIConfig.GET();
        let data: DataDTO = {};
        data.data = [];
        data.data.push(party);
        config.data = data;

        return this.put(`/parties/${party.id}`, config).then((res) => {
            // @ts-ignore
            return res.data.data;
        }).catch((err: Error) => {
            console.log("Caught error.");
            console.error(err);
            return null;
        });
    }

    /**
     * Gets the party by the ID.
     *
     * @param id The ID of the party.
     */
    public getById (id: number): Promise<PartyDTO> {
        return this.get<PartyDTO>(`/parties/${id}`).then((res) => {
            // @ts-ignore
            return res.data.data;
        }).catch((err: Error) => {
            console.log("Caught error trying to get party by ID.");
            console.error(err);
            return null;
        });
    }

    public async getByGuild (guildId: string): Promise<PartyDTO[]> {
        let params = {
            guild_id: guildId
        };
        return this.getByParameters(params);
    }

    public async getByCharacterAndId (characterId: string, id: number): Promise<PartyDTO[]> {
        let params: PartyQuery = {};
        let flag = false;
        if (characterId != null) {
            params.character_id = characterId;
            flag = true;
        }
        if (id != null) {
            params.id = id + "";
            flag = true;
        }

        if (!flag) {
            return Promise.resolve(null);
        }

        let parties = await this.getByParameters(params);
        if (!parties || parties.length <= 0) {
            return Promise.resolve(null);
        }

        return Promise.resolve(parties);
    }

    public async getByNameAndGuild(name: string, guildId: string): Promise<PartyDTO[]> {
        let params = {
            name: name,
            guild_id: guildId
        };
        return this.getByParameters(params);
    }

    public updatePartyWorld (party: PartyDTO, worldId: string): Promise<PartyDTO> {
        party.worldId = worldId;
        return this.save(party);
    }

    /**
     * Gets all parties in the given guild with a name similar.
     *
     * @param params
     */
    public getByParameters(params: any): Promise<PartyDTO[]> {
        let config = APIConfig.GET();
        config.params = params;

        return this.get(`/parties`, config).then((res) => {
            // @ts-ignore
            return res.data.data;
        }).catch((err: Error) => {
            console.log("Caught error.");
            console.error(err);
            return null;
        });
    }

    public async getPartyBasedOnInputOrUser(command: Command, message: Message, user: UserDTO, action: string): Promise<PartyDTO> {
        // Check the user has assigned a party or has one.
        let parties: PartyDTO[] = null;
        if (Subcommands.PARTY.isCommand(command)) {
            let ptCmd = Subcommands.PARTY.getCommand(command);
            if (ptCmd.getInput() != null) {
                parties = await this.getByNameAndGuild(ptCmd.getInput(), message.guild.id);
            }
        }

        if (parties == null) {
            parties = await this.getByCharacterAndId(user.defaultCharacterId, user.defaultPartyId);
        }

        // Nothing to return.
        if (parties == null || parties.length <= 0) {
            return Promise.resolve(null);
        }

        // No need to ask the user which one they want to use.
        if (parties.length == 1) {
            return Promise.resolve(parties[0]);
        }

        return this.partySelection(parties, action, message);
    }

    public async partySelection(parties: PartyDTO[], action: string, message: Message): Promise<PartyDTO> {
        return message.channel.send({ embeds: [PartyRelatedClientResponses.SELECT_PARTY(parties, action)]}).then((msg) => {
            return message.channel.awaitMessages({
                filter: m => m.author.id === message.author.id,
                max: 1,
                time: 10e3,
                errors: ['time'],
            }).then((input) => {
                msg.delete();
                let content = input.first().content;
                let choice = Number(content);
                if (isNaN(choice) || choice >= parties.length || choice < 0) {
                    message.channel.send("Input doesn't make sense!");
                    return null;
                }

                input.first().delete();
                return parties[choice];
            }).catch(()=> {
                msg.delete();
                message.channel.send("Message timed out.");
                return null;
            });
        });
    }
}