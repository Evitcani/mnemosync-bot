import {API} from "./base/API";
import {User} from "../entity/User";
import {apiConfig} from "./base/APIConfig";
import {injectable} from "inversify";

@injectable()
export class UserApi extends API {
    constructor () {
        super(apiConfig);
    }

    public async getById(id: number): Promise<User> {
        return this.get(`/user/${id}`).then((res) => {
            console.log(res.data);
        });
    }
}