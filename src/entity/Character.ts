import {TravelConfig} from "./TravelConfig";
import {Column, Entity, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";

@Entity({name: "characters"})
export class Character {
    @PrimaryColumn("Serial")
    id: number;

    @Column()
    img_url: string;

    @Column()
    name: string;

    @Column()
    travel_config: TravelConfig;

    @Column()
    party_id: number;
}