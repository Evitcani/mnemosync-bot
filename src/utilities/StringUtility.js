"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringUtility = void 0;
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
}
exports.StringUtility = StringUtility;
StringUtility.pattern = /(-?\d+)(\d{3})/;
//# sourceMappingURL=StringUtility.js.map