"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringUtility = void 0;
const sqlstring_1 = require("sqlstring");
class StringUtility {
    /**
     * A utility to format numbers with commas. Works extra quickly.
     *
     * @param input The number to format with commas.
     */
    static numberWithCommas(input) {
        let str = input.toString();
        while (this.pattern.test(str))
            str = str.replace(this.pattern, "$1,$2");
        return str;
    }
    /**
     * Escapes the given input to be placed in a database.
     *
     * @param input The input to escape.
     */
    static escapeMySQLInput(input) {
        return sqlstring_1.SqlString.escape(input);
    }
}
exports.StringUtility = StringUtility;
StringUtility.pattern = /(-?\d+)(\d{3})/;
//# sourceMappingURL=StringUtility.js.map