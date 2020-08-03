import {injectable} from "inversify";
import {Collection, Message} from "discord.js";
import {API} from "../base/API";
import {APIConfig} from "../base/APIConfig";
import {messageTypes} from "../../../shared/documentation/messages/MessageTypes";
import {CharacterDTO} from "@evitcani/mnemoshared/dist/src/dto/model/CharacterDTO";
import {NicknameDTO} from "@evitcani/mnemoshared/dist/src/dto/model/NicknameDTO";
import {DTOType} from "@evitcani/mnemoshared/dist/src/dto/DTOType";
import {DataDTO} from "@evitcani/mnemoshared/dist/src/dto/model/DataDTO";

@injectable()
export class CharacterController extends API<CharacterDTO> {
    constructor() {
        super(APIConfig.GET());
    }

    /**
     * Gets a character by ID.
     *
     * @param id The ID of the character to get.
     */
    public async getById(id: string): Promise<CharacterDTO> {
        return super.getByParams(`/characters/${id}`);
    }

    public async create(character: CharacterDTO, discordId?: string, worldId?: string): Promise<CharacterDTO> {
        // Create nickname for the mapping.
        const nickname: NicknameDTO = {dtoType: DTOType.NICKNAME};
        nickname.name = character.name;
        if (discordId != null) {
            nickname.discordId = discordId;
        }

        if (worldId != null) {
            nickname.worldId = worldId;
        }

        // Add the nickname to the character.
        character.nicknames = [];
        character.nicknames.push(nickname);

        return super.create(character, `/characters`);
    }

    public async createNickname (nickname: string, characterId: string, discordId?: string, worldId?: string): Promise<NicknameDTO> {
        // Create nickname for the mapping.
        const nn: NicknameDTO = {dtoType: DTOType.NICKNAME};
        nn.name = nickname;
        nn.characterId = characterId;
        if (!!discordId) {
            nn.discordId = discordId;
        }

        if (!!worldId) {
            nn.worldId = worldId;
        }

        let config = APIConfig.GET();
        let data: DataDTO = {};
        data.data = [];
        data.data.push(nn);
        config.data = data;

        return this.post(`/characters/${characterId}/nicknames`, config).then((res) => {
            // @ts-ignore
            return res.data.data;
        }).catch((err: Error) => {
            console.log("Caught error trying to create new party.");
            console.error(err);
            return null;
        });
    }

    public async getNPCByWorld (worldId: string) : Promise<CharacterDTO[]> {
        let params = {
            world_id: worldId,
            is_npc: true
        };

        return this.getByParameters(params);
    }

    public async getNPCByNameAndWorld (name: string, worldId: string) : Promise<CharacterDTO[]> {
        let params = {
            world_id: worldId,
            is_npc: true,
            name: name
        };

        return this.getByParameters(params);
    }

    public async getCharacterByName(name: string, discordId: string): Promise<CharacterDTO[]> {
        let params = {
            name: name,
            discord_id: discordId
        };

        return this.getByParameters(params);
    }

    protected async getByParameters(params: any): Promise<CharacterDTO[]> {
        return super.getAll(`/characters`, params);
    }

    /**
     * Gets all the discord IDs related to this character.
     * @param characterId
     */
    public async getDiscordId(characterId: string): Promise<Collection<string, string>> {
        let config = APIConfig.GET();
        config.params = {
            character_id: characterId
        };

        return this.get(`/discordIds`, config).then((res) => {
            // @ts-ignore
            if (!res || !res.data || !res.data.data) {
                return null;
            }

            // @ts-ignore
            let ids: string[] = res.data.data;

            let input = new Collection<string, string>();
            let discordId: string, i;
            for (i = 0; i < ids.length; i++) {
                discordId = ids[i];
                input.set(discordId, discordId);
            }

            return input;
        }).catch((err: Error) => {
            console.log("Caught error.");
            console.error(err);
            return null;
        });
    }

    public async selectCharacter(characters: CharacterDTO[], action: string, message: Message): Promise<CharacterDTO> {
        return this.selection(characters, action, messageTypes.character, message);
    }
}