"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractColumn = void 0;
class AbstractColumn {
    constructor(name, type) {
        this.name = name;
        this.type = type;
    }
    getName() {
        return this.name;
    }
    getType() {
        return this.type;
    }
}
exports.AbstractColumn = AbstractColumn;
//# sourceMappingURL=AbstractColumn.js.map