"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbColumn = void 0;
class DbColumn {
    constructor(name, value, sanitize) {
        this.name = name;
        this.value = value;
        this.sanitize = sanitize;
    }
    getName() {
        return this.name;
    }
    getValue() {
        return this.value;
    }
    needsSanitized() {
        return this.sanitize;
    }
}
exports.DbColumn = DbColumn;
//# sourceMappingURL=DbColumn.js.map