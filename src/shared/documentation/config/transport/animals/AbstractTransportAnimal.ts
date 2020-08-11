import {FoodWaterConfig} from "./FoodWaterConfig";
import {PartyTravelConfigDefaultValues} from "../../PartyTravelConfigDefaultValues";
import {CreatureSize} from "../enums/CreatureSize";

export abstract class AbstractTransportAnimal {
    private name: string;
    private cost_gold: number;
    private carrying_capacity_lbs: number;
    private allowed: boolean = true;
    private size: CreatureSize;
    private food_water_config: FoodWaterConfig;
    private speed_ft: number;

    constructor(name: string, cost_gold: number, carrying_capacity_lbs: number, size: CreatureSize) {
        this.name = name;
        this.cost_gold = cost_gold;
        this.carrying_capacity_lbs = carrying_capacity_lbs;
        this.size = size;

        this.food_water_config = FoodWaterConfig.getDefaultSize(this.size);
    }

    /**
     * Gets the carrying capacity of this transport animal, in lbs.
     */
    public getCarryingCapacity(): number {
        return this.carrying_capacity_lbs;
    }

    public setCarryingCapacity(carryingCapacityLbs: number): AbstractTransportAnimal {
        this.carrying_capacity_lbs = carryingCapacityLbs;
        return this;
    }

    public getDraggingCapacity(): number {
        return this.carrying_capacity_lbs * PartyTravelConfigDefaultValues.DRAGGING_CAPACITY_MULTIPLIER;
    }

    public isAllowed(): boolean {
        return this.allowed;
    }

    public getSpeed(): number {
        return this.speed_ft;
    }
}