"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbColumn = void 0;
const DatabaseDivider_1 = require("../../../../enums/DatabaseDivider");
const StringUtility_1 = require("../../../../utilities/StringUtility");
class DbColumn {
    constructor(name, value) {
        this.sanitize = false;
        this.divider = DatabaseDivider_1.DatabaseDivider.DEFAULT;
        this.name = name;
        this.value = value;
    }
    getName() {
        return this.name;
    }
    getValue() {
        let value;
        if (this.divider == DatabaseDivider_1.DatabaseDivider.LIKE) {
            value = `%${this.value}%`;
        }
        else {
            value = this.value;
        }
        if (this.needsSanitized()) {
            value = StringUtility_1.StringUtility.escapeMySQLInput(value);
        }
        return value;
    }
    needsSanitized() {
        return this.sanitize;
    }
    setSanitized(sanitize) {
        this.sanitize = sanitize;
        return this;
    }
    setDivider(divider) {
        this.divider = divider;
        return this;
    }
    getDivider() {
        return this.divider;
    }
}
exports.DbColumn = DbColumn;
//# sourceMappingURL=DbColumn.js.map