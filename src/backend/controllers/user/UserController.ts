import {injectable} from "inversify";
import {UserDTO} from "../../api/dto/model/UserDTO";
import {CharacterDTO} from "../../api/dto/model/CharacterDTO";
import {WorldDTO} from "../../api/dto/model/WorldDTO";
import {API} from "../base/API";
import {DataDTO} from "../../api/dto/model/DataDTO";
import {APIConfig} from "../base/APIConfig";

@injectable()
export class UserController extends API {
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
        user.defaultCharacterId = character.id;

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
            user.defaultWorldId = world.id;
        } else {
            user.defaultWorldId = null;
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
        let config = APIConfig.GET();
        let data: DataDTO = {};
        data.data = [];
        data.data.push(user);
        config.data = data;

        return this.put(`/users/${discordId}`, config).then((res) => {
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