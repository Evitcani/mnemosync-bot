"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringUtility = void 0;
const SqlString = require('sqlstring');
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
    static replaceFancyQuotes(input) {
        if (input == null) {
            return null;
        }
        let correctedInput = input.replace(new RegExp("[" + ["‘", "’"] + "]+"), "'");
        correctedInput = correctedInput.replace(new RegExp("[" + ["“", "”"] + "]+"), "\"");
        return correctedInput;
    }
    /**
     * Escapes the given input to be placed in a database.
     *
     * @param input The input to escape.
     */
    static escapeMySQLInput(input) {
        return SqlString.escape(input);
    }
    static escapeSQLInput(input) {
        if (input == null) {
            return null;
        }
        let sanitizedInput = StringUtility.escapeMySQLInput(input);
        // Trim off trailing
        sanitizedInput = sanitizedInput.replace(new RegExp("[" + this.charlist + "]+$"), "");
        sanitizedInput = sanitizedInput.replace(new RegExp("^[" + this.charlist + "]+"), "");
        return sanitizedInput;
    }
}
exports.StringUtility = StringUtility;
/** List of characters to trim from commands. */
StringUtility.charlist = [" ", "\"", "'"];
StringUtility.pattern = /(-?\d+)(\d{3})/;
//# sourceMappingURL=StringUtility.js.map