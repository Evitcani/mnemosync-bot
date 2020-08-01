import {injectable} from "inversify";
import {Collection} from "discord.js";
import {API} from "../base/API";
import {CharacterDTO} from "../../api/dto/model/CharacterDTO";
import {DataDTO} from "../../api/dto/model/DataDTO";
import {NicknameDTO} from "../../api/dto/model/NicknameDTO";
import {DTOType} from "../../api/dto/DTOType";
import {APIConfig} from "../base/APIConfig";

@injectable()
export class CharacterController extends API {
    constructor() {
        super(APIConfig.GET());
    }

    /**
     * Gets a character by ID.
     *
     * @param id The ID of the character to get.
     */
    public async getById(id: number): Promise<CharacterDTO> {
        let config = APIConfig.GET();
        let data: DataDTO = {};
        let character: CharacterDTO = {dtoType: DTOType.CHARACTER};
        character.id = id;
        data.data = [];
        data.data.push(character);
        config.data = data;

        return this.get(`/characters/${id}`, config).then((res) => {
            console.log(res.data);
            // @ts-ignore
            return res.data.data;
        }).catch((err: Error) => {
            console.log("Caught error.");
            console.error(err);
            return null;
        });
    }

    public async create(character: CharacterDTO, discordId: string): Promise<CharacterDTO> {
        // Create nickname for the mapping.
        const nickname: NicknameDTO = {dtoType: DTOType.NICKNAME};
        nickname.name = character.name;
        nickname.discordId = discordId;

        // Add the nickname to the character.
        character.nicknames = [];
        character.nicknames.push(nickname);

        let config = APIConfig.GET();
        let data: DataDTO = {};
        data.data = [];
        data.data.push(character);
        config.data = data;

        return this.post(`/characters`, config).then((res) => {
            console.log(res.data);
            // @ts-ignore
            return res.data.data;
        }).catch((err: Error) => {
            console.log("Caught error trying to create character.");
            console.error(err);
            return null;
        });
    }

    public async createNickname (nickname: string, character: CharacterDTO, discordId: string): Promise<NicknameDTO> {
        // Create nickname for the mapping.
        const nn: NicknameDTO = {dtoType: DTOType.NICKNAME};
        nn.name = nickname;
        nn.discordId = discordId;
        let config = APIConfig.GET();
        let data: DataDTO = {};
        data.data = [];
        data.data.push(nn);
        config.data = data;

        return this.post(`/characters/${character.id}/nicknames`, config).then((res) => {
            console.log(res.data);
            // @ts-ignore
            return res.data.data;
        }).catch((err: Error) => {
            console.log("Caught error trying to create new party.");
            console.error(err);
            return null;
        });
    }

    public async getCharacterByName(name: string, discordId: string): Promise<CharacterDTO> {
        let config = APIConfig.GET();
        config.params = {
            name: name,
            discord_id: discordId
        };

        return this.get(`/characters`, config).then((res) => {
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
     * Gets all the discord IDs related to this character.
     * @param characterId
     */
    public async getDiscordId(characterId: number): Promise<Collection<string, string>> {
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
}