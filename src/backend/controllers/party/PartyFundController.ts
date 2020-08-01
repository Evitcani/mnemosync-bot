import {injectable} from "inversify";
import {PartyFundDTO} from "../../api/dto/model/PartyFundDTO";
import {PartyDTO} from "../../api/dto/model/PartyDTO";
import {API} from "../../api/controller/base/API";
import {apiConfig} from "../../api/controller/base/APIConfig";
import {DataDTO} from "../../api/dto/model/DataDTO";
import {DTOType} from "../../api/dto/DTOType";

@injectable()
export class PartyFundController extends API {
    constructor() {
        super(apiConfig);
    }

    /**
     * Creates a new party fund for the given party and type.
     *
     * @param party The party this fund is for.
     * @param type The type of fund this is.
     */
    public async create(party: PartyDTO, type: string): Promise<PartyFundDTO> {
        let fund: PartyFundDTO = {dtoType: DTOType.PARTY_FUND};
        fund.type = type;
        fund.party = {dtoType: DTOType.PARTY};
        fund.party.id = party.id;
        fund.copper = 0;
        fund.silver = 0;
        fund.gold = 0;
        fund.platinum = 0;

        let config = apiConfig;
        let data: DataDTO = {};
        data.data = [];
        data.data.push(fund);
        config.data = data;

        return this.post(`/party/${party.id}/fund`, config).then((res) => {
            console.log(res.data);
            // @ts-ignore
            return res.data.data;
        }).catch((err: Error) => {
            console.log("Caught error trying to create new party fund.");
            console.error(err);
            return null;
        });
    }

    public async getByPartyAndType(party: PartyDTO, type: string): Promise<PartyFundDTO> {
        if (!party) {
            return null;
        }

        if (type == null) {
           type = "FUND";
        }

        type = type.toLowerCase();

        return this.get(`/party/${party.id}/fund/${type}`).then((res) => {
            console.log(res.data);
            // @ts-ignore
            return res.data.data;
        }).catch((err: Error) => {
            console.log("Caught error trying to get fund.");
            console.error(err);
            return null;
        });
    }

    public async updateFunds (party: PartyDTO, fund: PartyFundDTO): Promise<PartyFundDTO> {
        let config = apiConfig;
        let data: DataDTO = {};
        data.data = [];
        data.data.push(fund);
        config.data = data;

        return this.post(`/party/${party.id}/fund/${fund.type.toLowerCase()}`, config)
            .then((res) => {
                console.log(res.data);
                // @ts-ignore
                return res.data.data;
            }).catch((err: Error) => {
                console.log("Caught error trying to update fund.");
                console.error(err);
                return null;
            });
    }
}