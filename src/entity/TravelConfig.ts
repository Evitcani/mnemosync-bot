import {Column, Entity, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Character} from "./Character";

@Entity({name: "travel_configs"})
export class TravelConfig {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @OneToOne(type => Character, character => character.travel_config)
    character: Character;

    @Column()
    can_eat: boolean;

    @Column()
    can_drink_water: boolean;

    @Column({ nullable: true })
    inventory_weight?: number;

    @Column({ nullable: true })
    weight?: number;
}