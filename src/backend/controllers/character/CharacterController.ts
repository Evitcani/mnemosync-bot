import {injectable} from "inversify";
import {NameValuePair} from "../Base/NameValuePair";
import {getConnection} from "typeorm";
import {StringUtility} from "../../utilities/StringUtility";
import {Collection} from "discord.js";
import {API} from "../../api/controller/base/API";
import {apiConfig} from "../../api/controller/base/APIConfig";
import {CharacterDTO} from "../../api/dto/model/CharacterDTO";
import {DataDTO} from "../../api/dto/model/DataDTO";
import {NicknameDTO} from "../../api/dto/model/NicknameDTO";
import {DTOType} from "../../api/dto/DTOType";
import {PartyDTO} from "../../api/dto/model/PartyDTO";
import {UserDTO} from "../../api/dto/model/UserDTO";

@injectable()
export class CharacterController extends API {
    constructor() {
        super(apiConfig);
    }

    /**
     * Gets a character by ID.
     *
     * @param id The ID of the character to get.
     */
    public async getById(id: number): Promise<CharacterDTO> {
        let config = apiConfig;
        let data: DataDTO = {};
        let character: CharacterDTO = {dtoType: DTOType.CHARACTER};
        character.id = id;
        data.data = [];
        data.data.push(character);
        config.data = data;

        return this.get(`/character/${id}`, config).then((res) => {
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

        // Add the nickname to the character.
        character.nicknames = [];
        character.nicknames.push(nickname);

        let config = apiConfig;
        let data: DataDTO = {};
        data.data = [];
        data.data.push(character);
        config.data = data;

        return this.post(`/character`, config).then((res) => {
            console.log(res.data);
            // @ts-ignore
            return res.data.data;
        }).catch((err: Error) => {
            console.log("Caught error trying to create new party.");
            console.error(err);
            return null;
        });
    }

    public async createNickname (nickname: string, character: CharacterDTO, discordId: string): Promise<NicknameDTO> {
        // Create nickname for the mapping.
        const nn: NicknameDTO = {dtoType: DTOType.NICKNAME};
        nn.name = character.name;
        let config = apiConfig;
        let data: DataDTO = {};
        data.data = [];
        data.data.push(nn);
        config.data = data;

        return this.post(`/character/${character.id}/nickname`, config).then((res) => {
            console.log(res.data);
            // @ts-ignore
            return res.data.data;
        }).catch((err: Error) => {
            console.log("Caught error trying to create new party.");
            console.error(err);
            return null;
        });
    }

    public async getCharacterByNameInParties (name: string, parties: PartyDTO[]): Promise<CharacterDTO[]> {
        let sanitizedName = StringUtility.escapeSQLInput(name);
        let partyIds: number[] = [], i;
        for (i = 0; i < parties.length; i++) {
            partyIds.push(parties[i].id);
        }

        return getConnection()
            .createQueryBuilder(CharacterD, "character")
            .leftJoinAndSelect(Nickname, "nick", `character.id = "nick"."characterId"`)
            .where(`LOWER("nick"."name") LIKE LOWER('%${sanitizedName}%')`)
            .andWhere(`"character"."partyId" = ANY(ARRAY[${partyIds.join(",")}])`)
            .getMany()
            .then((characters) => {
                if (!characters || characters.length < 1) {
                    return null;
                }

                return characters;
            })
            .catch((err: Error) => {
                console.error("ERR ::: Could not get characters.");
                console.error(err);
                return null;
            });
    }

    public async getCharacterByName(name: string, discordId: string): Promise<CharacterDTO> {
        return this.getNicknameByNickname(name, discordId).then((nickname) => {
            if (nickname == null || nickname.length < 1) {
                return null;
            }

            if (nickname[0].character == null) {
                return this.getById(nickname[0].characterId);
            }

            return nickname[0].character;
        })
    }

    /**
     * Gets all the discord IDs related to this character.
     * @param characterId
     */
    public async getDiscordId(characterId: number): Promise<Collection<string, string>> {
        return this.getSecondaryRepo().find({where: {characterId: characterId}}).then((nicknames) => {
            if (!nicknames || nicknames.length < 1) {
                return null;
            }

            let input = new Collection<string, string>();
            let nickname: Nickname, discordId: string, i;
            for (i = 0; i < nicknames.length; i++) {
                nickname = nicknames[i];
                discordId = nickname.discord_id;
                input.set(discordId, discordId);
            }

            return input;
        });
    }

    private async getNicknameByNickname(nickname: string, discordId: string): Promise<Nickname[]> {
        return this.getSecondaryLikeArgs(
            [new NameValuePair("discord_id", discordId)],
            [new NameValuePair("name", nickname)])
            .catch((err: Error) => {
                console.error("ERR ::: Could not get nickname.");
                console.error(err);
                return null;
            });
    }
}