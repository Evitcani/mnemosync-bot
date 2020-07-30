import {API} from "./base/API";
import {apiConfig} from "./base/APIConfig";
import {injectable} from "inversify";
import {UserDTO} from "../dto/model/UserDTO";
import {DataDTO} from "../dto/model/DataDTO";

@injectable()
export class UserApi extends API {
    constructor () {
        super(apiConfig);
    }

    public async getById(discordId: string, discordName: string): Promise<UserDTO> {
        let config = apiConfig;
        let data = new DataDTO();
        let user: UserDTO = {};
        user.discord_id = discordId;
        user.discord_name = discordName;
        config.data = data;

        return this.get<UserDTO>(`/user/${discordId}`, config).then((res) => {
            console.log(res.data);
            return null;
        }).catch((err: Error) => {
            console.log("Caught error.");
            console.error(err);
            return null;
        });
    }
}