"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoneyType = void 0;
const MoneyArchetype_1 = require("../models/generic/MoneyArchetype");
class MoneyType {
}
exports.MoneyType = MoneyType;
MoneyType.PLATINUM = new MoneyArchetype_1.MoneyArchetype("platinum", "p", 1000);
MoneyType.GOLD = new MoneyArchetype_1.MoneyArchetype("gold", "g", 100);
MoneyType.SILVER = new MoneyArchetype_1.MoneyArchetype("silver", "s", 10);
MoneyType.COPPER = new MoneyArchetype_1.MoneyArchetype("copper", "c", 1);
//# sourceMappingURL=MoneyType.js.map