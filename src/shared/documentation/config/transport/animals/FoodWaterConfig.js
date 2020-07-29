"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoodWaterConfig = void 0;
const CreatureSize_1 = require("../enums/CreatureSize");
class FoodWaterConfig {
    constructor(feedPerDayLbs, waterPerDayGallons) {
        this.feed_per_day_lbs = feedPerDayLbs;
        this.water_per_day_gallons = waterPerDayGallons;
    }
    getFeedPerDay() {
        return this.feed_per_day_lbs;
    }
    getWaterPerDay() {
        return this.water_per_day_gallons;
    }
    /**
     * Gets the default food and water needs based on the creature's size.
     *
     * @param size The size of the creature.
     */
    static getDefaultSize(size) {
        switch (size) {
            case CreatureSize_1.CreatureSize.HUGE:
                return new FoodWaterConfig(16, 16);
            case CreatureSize_1.CreatureSize.LARGE:
                return new FoodWaterConfig(4, 4);
            default:
                return new FoodWaterConfig(1, 1);
        }
    }
}
exports.FoodWaterConfig = FoodWaterConfig;
//# sourceMappingURL=FoodWaterConfig.js.map