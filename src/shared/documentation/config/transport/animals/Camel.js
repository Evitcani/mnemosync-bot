"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Camel = void 0;
const AbstractTransportAnimal_1 = require("./AbstractTransportAnimal");
const CreatureSize_1 = require("../enums/CreatureSize");
class Camel extends AbstractTransportAnimal_1.AbstractTransportAnimal {
    constructor() {
        super("Camel", 50, 480, CreatureSize_1.CreatureSize.LARGE);
    }
}
exports.Camel = Camel;
//# sourceMappingURL=Camel.js.map