"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mule = void 0;
const AbstractTransportAnimal_1 = require("./AbstractTransportAnimal");
const CreatureSize_1 = require("../enums/CreatureSize");
class Mule extends AbstractTransportAnimal_1.AbstractTransportAnimal {
    constructor() {
        super("Mule", 8, 420, CreatureSize_1.CreatureSize.LARGE);
    }
}
exports.Mule = Mule;
//# sourceMappingURL=Mule.js.map