import {API} from "./base/API";
import {apiConfig} from "./base/APIConfig";
import {injectable} from "inversify";
import {UserDTO} from "../dto/model/UserDTO";
import {DataDTO} from "../dto/model/DataDTO";
import {WorldDTO} from "../dto/model/WorldDTO";

@injectable()
export class UserApi extends API {
    constructor () {
        super(apiConfig);
    }

    public async getById(discordId: string, discordName: string): Promise<UserDTO> {

    }

    public async save (discordId: string, user: UserDTO): Promise<UserDTO> {

    }

    public async addWorld (user: UserDTO, world: WorldDTO): Promise<WorldDTO> {

    }
}