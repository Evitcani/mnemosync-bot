"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DraftHorse = void 0;
const AbstractTransportAnimal_1 = require("./AbstractTransportAnimal");
const CreatureSize_1 = require("../enums/CreatureSize");
class DraftHorse extends AbstractTransportAnimal_1.AbstractTransportAnimal {
    constructor() {
        super("Horse, Draft", 50, 540, CreatureSize_1.CreatureSize.LARGE);
    }
}
exports.DraftHorse = DraftHorse;
//# sourceMappingURL=DraftHorse.js.map