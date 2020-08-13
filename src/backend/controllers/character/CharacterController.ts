import {injectable} from "inversify";
import {Collection, Message} from "discord.js";
import {API} from "../base/API";
import {APIConfig} from "../base/APIConfig";
import {messageTypes} from "../../../shared/documentation/messages/MessageTypes";
import {CharacterDTO} from "mnemoshared/dist/src/dto/model/CharacterDTO";
import {NicknameDTO} from "mnemoshared/dist/src/dto/model/NicknameDTO";
import {DTOType} from "mnemoshared/dist/src/dto/DTOType";
import {DataDTO} from "mnemoshared/dist/src/dto/model/DataDTO";

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
        return super.create(character, `/characters`);
    }

    public async createNickname (nickname: string, characterId: string, discordId?: string): Promise<NicknameDTO> {
        // Create nickname for the mapping.
        const nn: NicknameDTO = {dtoType: DTOType.NICKNAME};
        nn.name = nickname;
        nn.characterId = characterId;
        if (!!discordId) {
            nn.discordId = discordId;
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

    public async getCharacterByNameAndWorld(name: string, worldId: string): Promise<CharacterDTO[]> {
        let params = {
            name: name,
            world_id: worldId
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

    public async selectCharacter(characters: CharacterDTO[], action: string, message: Message): Promise<CharacterDTO> {
        return this.selection(characters, action, messageTypes.character, message);
    }
}