import {TravelConfig} from "./TravelConfig";

export interface Character {
    id: number;
    img_url: string;
    name: string;
    travel_config: TravelConfig;
    party_id: number;
}