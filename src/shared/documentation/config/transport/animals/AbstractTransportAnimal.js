"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractTransportAnimal = void 0;
const FoodWaterConfig_1 = require("./FoodWaterConfig");
const PartyTravelConfigDefaultValues_1 = require("../../PartyTravelConfigDefaultValues");
class AbstractTransportAnimal {
    constructor(name, cost_gold, carrying_capacity_lbs, size) {
        this.allowed = true;
        this.name = name;
        this.cost_gold = cost_gold;
        this.carrying_capacity_lbs = carrying_capacity_lbs;
        this.size = size;
        this.food_water_config = FoodWaterConfig_1.FoodWaterConfig.getDefaultSize(this.size);
    }
    /**
     * Gets the carrying capacity of this transport animal, in lbs.
     */
    getCarryingCapacity() {
        return this.carrying_capacity_lbs;
    }
    setCarryingCapacity(carryingCapacityLbs) {
        this.carrying_capacity_lbs = carryingCapacityLbs;
        return this;
    }
    getDraggingCapacity() {
        return this.carrying_capacity_lbs * PartyTravelConfigDefaultValues_1.PartyTravelConfigDefaultValues.DRAGGING_CAPACITY_MULTIPLIER;
    }
    isAllowed() {
        return this.allowed;
    }
    getSpeed() {
        return this.speed_ft;
    }
}
exports.AbstractTransportAnimal = AbstractTransportAnimal;
//# sourceMappingURL=AbstractTransportAnimal.js.map