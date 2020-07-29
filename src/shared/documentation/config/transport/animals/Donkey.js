"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Donkey = void 0;
const AbstractTransportAnimal_1 = require("./AbstractTransportAnimal");
const CreatureSize_1 = require("../enums/CreatureSize");
class Donkey extends AbstractTransportAnimal_1.AbstractTransportAnimal {
    constructor() {
        super("Donkey", 8, 420, CreatureSize_1.CreatureSize.LARGE);
    }
}
exports.Donkey = Donkey;
//# sourceMappingURL=Donkey.js.map