import {API} from "./base/API";
import {apiConfig} from "./base/APIConfig";
import {injectable} from "inversify";
import {UserDTO} from "../dto/UserDTO";

@injectable()
export class UserApi extends API {
    constructor () {
        super(apiConfig);
    }

    public async getById(id: string): Promise<UserDTO> {
        return this.get<UserDTO>(`/user/${id}`).then((res) => {
            console.log(res.data);
            return null;
        }).catch((err: Error) => {
            console.log("Caught error.");
            console.error(err);
            return null;
        });
    }
}