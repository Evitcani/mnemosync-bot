import {injectable} from "inversify";
import {API} from "../base/API";
import {APIConfig} from "../base/APIConfig";
import {UserDTO} from "mnemoshared/dist/src/dto/model/UserDTO";
import {DataDTO} from "mnemoshared/dist/src/dto/model/DataDTO";
import {WorldDTO} from "mnemoshared/dist/src/dto/model/WorldDTO";
import {CharacterDTO} from "mnemoshared/dist/src/dto/model/CharacterDTO";
import {Collection} from "discord.js";

@injectable()
export class UserController extends API<UserDTO> {
    /**
     * Construct this controller.
     */
    constructor() {
        super(APIConfig.GET());
    }

    /**
     * Gets the user.
     *
     * @param discordId The discord ID of the user.
     * @param discordName The discord name of user.
     */
    public async getById(discordId: string, discordName: string): Promise<UserDTO> {
        let config = APIConfig.GET();
        config.params = {
            discord_name: discordName
        };
        return this.get(`/users/${discordId}`, config).then((res) => {
            // @ts-ignore
            return res.data.data;
        }).catch((err: Error) => {
            console.log("Caught error.");
            console.error(err);
            return null;
        });
    }

    /**
     * Updates the default character.
     *
     * @param user The user to update.
     * @param character The new character to make default.
     */
    public async updateDefaultCharacter(user: UserDTO, character: CharacterDTO): Promise<UserDTO> {
        user.defaultCharacterId = character.id;

        return this.saveOff(user.discord_id, user);
    }

    /**
     * Updates the default characters.
     *
     * @param user The user to update.
     * @param world The new character to make default.
     */
    public async updateDefaultWorld(user: UserDTO, world: WorldDTO): Promise<UserDTO> {
        if (world != null) {
            user.defaultWorldId = world.id;
        } else {
            user.defaultWorldId = null;
        }
        return this.saveOff(user.discord_id,user);
    }

    /**
     * Saves the user.
     *
     * @param discordId
     * @param user
     */
    public async saveOff(discordId: string, user: UserDTO): Promise<UserDTO> {
        let config = APIConfig.GET();
        let data: DataDTO = {};
        data.data = [];
        data.data.push(user);
        config.data = data;

        return this.put(`/users/${discordId}`, config).then((res) => {
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
     * @param characterIds
     * @param worldId
     */
    public async getDiscordId(characterIds: string[], worldId: string): Promise<Collection<string, string>> {
        let config = APIConfig.GET();
        config.params = {
            character_ids: characterIds,
            world_id: worldId
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