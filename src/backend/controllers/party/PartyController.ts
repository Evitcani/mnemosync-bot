import {injectable} from "inversify";
import {Subcommands} from "../../../shared/documentation/commands/Subcommands";
import {Command} from "../../../shared/models/generic/Command";
import {Message} from "discord.js";
import {PartyRelatedClientResponses} from "../../../shared/documentation/client-responses/information/PartyRelatedClientResponses";
import {PartyDTO} from "../../api/dto/model/PartyDTO";
import {UserDTO} from "../../api/dto/model/UserDTO";
import {WorldDTO} from "../../api/dto/model/WorldDTO";
import {API} from "../../api/controller/base/API";
import {apiConfig} from "../../api/controller/base/APIConfig";
import {DataDTO} from "../../api/dto/model/DataDTO";
import {DTOType} from "../../api/dto/DTOType";

@injectable()
export class PartyController extends API {
    constructor() {
        super(apiConfig);
    }

    /**
     * Creates a new party in the server with the given name.
     *
     * @param partyName The name of the party.
     * @param guildId The ID of the guild for this party to live in.
     * @param discordId The discord id of the creator.
     */
    public create(partyName: string, guildId: string, discordId: string): Promise<PartyDTO> {
        const party: PartyDTO = {dtoType: DTOType.PARTY};
        party.name = partyName;
        party.guildId = guildId;
        party.creatorDiscordId = discordId;

        let config = apiConfig;
        let data: DataDTO = {};
        data.data = [];
        data.data.push(party);
        config.data = data;

        return this.post(`/party`, config).then((res) => {
            console.log(res.data);
            // @ts-ignore
            return res.data.data;
        }).catch((err: Error) => {
            console.log("Caught error trying to create new party.");
            console.error(err);
            return null;
        });
    }

    public save (party: PartyDTO): Promise<PartyDTO> {
        let config = apiConfig;
        let data: DataDTO = {};
        data.data = [];
        data.data.push(party);
        config.data = data;

        return this.post(`/party/${party.id}`, config).then((res) => {
            console.log(res.data);
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
        let config = apiConfig;
        let data: DataDTO = {};
        let party: PartyDTO = {dtoType: DTOType.PARTY};
        party.id = id;
        data.data = [];
        data.data.push(party);
        config.data = data;

        return this.get<PartyDTO>(`/party/${id}`, config).then((res) => {
            console.log(res.data);
            // @ts-ignore
            return res.data.data;
        }).catch((err: Error) => {
            console.log("Caught error trying to get party by ID.");
            console.error(err);
            return null;
        });
    }

    public getByGuild (guildId: string): Promise<PartyDTO[]> {
        return this.getByNameAndGuild(null, guildId);
    }

    public getByWorld (world: WorldDTO): Promise<PartyDTO[]> {
        let config = apiConfig;
        let data: DataDTO = {};
        let party: PartyDTO = {dtoType: DTOType.PARTY};
        party.world = {dtoType: DTOType.WORLD};
        party.world.id = world.id;
        data.data = [];
        data.data.push(party);
        config.data = data;

        return this.get(`/world/${world.id}/party`, config).then((res) => {
            console.log(res.data);
            // @ts-ignore
            return res.data.data;
        }).catch((err: Error) => {
            console.log("Caught error.");
            console.error(err);
            return null;
        });
    }

    public updatePartyWorld (party: PartyDTO, world: WorldDTO): Promise<PartyDTO> {
        party.world = world;
        return this.save(party);
    }

    /**
     * Gets all parties in the given guild with a name similar.
     *
     * @param partyName The name of the party to get.
     * @param guildId The ID of the guild the party lives in.
     */
    public getByNameAndGuild(partyName: string, guildId: string): Promise<PartyDTO[]> {
        let config = apiConfig;
        let data: DataDTO = {};
        let party: PartyDTO = {dtoType: DTOType.PARTY};
        party.guildId = guildId;
        party.name = partyName;
        data.data = [];
        data.data.push(party);
        config.data = data;

        return this.get(`/guild/${guildId}/party`, config).then((res) => {
            console.log(res.data);
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
            parties = [];
            if (user.defaultCharacter != null && user.defaultCharacter.party != null) {
                parties.push(user.defaultCharacter.party);
            }

            if (user.defaultParty != null) {
                parties.push(user.defaultParty);
            }
        }

        // Nothing to return.
        if (parties.length <= 0) {
            return Promise.resolve(null);
        }

        // No need to ask the user which one they want to use.
        if (parties.length == 1) {
            return Promise.resolve(parties[0]);
        }

        return this.partySelection(parties, action, message);
    }

    public async partySelection(parties: PartyDTO[], action: string, message: Message): Promise<PartyDTO> {
        return message.channel.send(PartyRelatedClientResponses.SELECT_PARTY(parties, action)).then((msg) => {
            return message.channel.awaitMessages(m => m.author.id === message.author.id, {
                max: 1,
                time: 10e3,
                errors: ['time'],
            }).then((input) => {
                msg.delete({reason: "Removed party processing command."});
                let content = input.first().content;
                let choice = Number(content);
                if (isNaN(choice) || choice >= parties.length || choice < 0) {
                    message.channel.send("Input doesn't make sense!");
                    return null;
                }

                input.first().delete();
                return parties[choice];
            }).catch(()=> {
                msg.delete({reason: "Removed party processing command."});
                message.channel.send("Message timed out.");
                return null;
            });
        });
    }
}