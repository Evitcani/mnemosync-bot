import {CreatureSize} from "../../../../enums/CreatureSize";

export class FoodWaterConfig {
    private readonly feed_per_day_lbs: number;
    private readonly water_per_day_gallons: number;

    constructor(feedPerDayLbs: number, waterPerDayGallons: number) {
        this.feed_per_day_lbs = feedPerDayLbs;
        this.water_per_day_gallons = waterPerDayGallons;
    }

    public getFeedPerDay(): number {
        return this.feed_per_day_lbs;
    }

    public getWaterPerDay(): number {
        return this.water_per_day_gallons;
    }

    /**
     * Gets the default food and water needs based on the creature's size.
     *
     * @param size The size of the creature.
     */
    public static getDefaultSize(size: CreatureSize): FoodWaterConfig {
        switch (size) {
            case CreatureSize.HUGE:
                return new FoodWaterConfig(16, 16);
            case CreatureSize.LARGE:
                return new FoodWaterConfig(4, 4);
            default:
                return new FoodWaterConfig(1, 1);
        }
    }
}