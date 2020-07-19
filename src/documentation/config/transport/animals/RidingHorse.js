"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RidingHorse = void 0;
const AbstractTransportAnimal_1 = require("./AbstractTransportAnimal");
const CreatureSize_1 = require("../../../../enums/CreatureSize");
class RidingHorse extends AbstractTransportAnimal_1.AbstractTransportAnimal {
    constructor() {
        super("Horse, Riding", 75, 480, CreatureSize_1.CreatureSize.LARGE);
    }
}
exports.RidingHorse = RidingHorse;
//# sourceMappingURL=RidingHorse.js.map