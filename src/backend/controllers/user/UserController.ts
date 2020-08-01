import {injectable} from "inversify";
import {UserDTO} from "../../api/dto/model/UserDTO";
import {CharacterDTO} from "../../api/dto/model/CharacterDTO";
import {WorldDTO} from "../../api/dto/model/WorldDTO";
import {API} from "../../api/controller/base/API";
import {apiConfig} from "../../api/controller/base/APIConfig";
import {DataDTO} from "../../api/dto/model/DataDTO";
import {DTOType} from "../../api/dto/DTOType";

@injectable()
export class UserController extends API {
    /**
     * Construct this controller.
     */
    constructor() {
        super(apiConfig);
    }

    /**
     * Gets the user.
     *
     * @param discordId The discord ID of the user.
     * @param discordName The discord name of user.
     */
    public async getById(discordId: string, discordName: string): Promise<UserDTO> {
        let config = apiConfig;
        config.params = {
            discord_name: discordName
        };
        return this.get(`/user/${discordId}`, config).then((res) => {
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
     * Updates the default character.
     *
     * @param user The user to update.
     * @param character The new character to make default.
     */
    public async updateDefaultCharacter(user: UserDTO, character: CharacterDTO): Promise<UserDTO> {
        user.defaultCharacter = character;

        return this.save(user.discord_id, user);
    }

    /**
     * Updates the default characters.
     *
     * @param user The user to update.
     * @param world The new character to make default.
     */
    public async updateDefaultWorld(user: UserDTO, world: WorldDTO): Promise<UserDTO> {
        if (world != null) {
            user.defaultWorld = world;
        } else {
            user.defaultWorld = null;
        }
        return this.save(user.discord_id,user);
    }

    /**
     * Saves the user.
     *
     * @param discordId
     * @param user
     */
    public async save(discordId: string, user: UserDTO): Promise<UserDTO> {
        let config = apiConfig;
        let data: DataDTO = {};
        data.data = [];
        data.data.push(user);
        config.data = data;

        return this.put(`/user/${discordId}`, config).then((res) => {
            console.log(res.data);
            // @ts-ignore
            return res.data.data;
        }).catch((err: Error) => {
            console.log("Caught error.");
            console.error(err);
            return null;
        });
    }
}