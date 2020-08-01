import {injectable} from "inversify";
import {API} from "../../../api/controller/base/API";
import {apiConfig} from "../../../api/controller/base/APIConfig";
import {DataDTO} from "../../../api/dto/model/DataDTO";
import {CurrentDateDTO} from "../../../api/dto/model/CurrentDateDTO";
import {PartyDTO} from "../../../api/dto/model/PartyDTO";

@injectable()
export class CurrentDateController extends API {
    constructor() {
        super(apiConfig);
    }

    public async getById(id: string): Promise<CurrentDateDTO> {
        return this.get(`/currentDate/${id}`).then((res) => {
            console.log(res.data);
            // @ts-ignore
            return res.data.data;
        }).catch((err: Error) => {
            console.log("Caught error trying to get the current date.");
            console.error(err);
            return null;
        });
    }

    public async create(currentDate: CurrentDateDTO, party: PartyDTO): Promise<CurrentDateDTO> {
        let config = apiConfig;
        let data: DataDTO = {};
        data.data = [];
        data.data.push(currentDate);
        config.data = data;
        config.params = {
            party_id: party.id
        };

        return this.post(`/currentDate`, config).then((res) => {
            console.log(res.data);
            // @ts-ignore
            return res.data.data;
        }).catch((err: Error) => {
            console.log("Caught error trying to create new current date for party.");
            console.error(err);
            return null;
        });
    }

    public async save(currentDate: CurrentDateDTO): Promise<CurrentDateDTO> {
        let config = apiConfig;
        let data: DataDTO = {};
        data.data = [];
        data.data.push(currentDate);
        config.data = data;

        return this.put(`/currentDate/${currentDate.id}`, config).then((res) => {
            console.log(res.data);
            // @ts-ignore
            return res.data.data;
        }).catch((err: Error) => {
            console.log("Caught error trying to update current date.");
            console.error(err);
            return null;
        });
    }
}