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
        let correctedInput = input.replace(this.fancyQuote1, "'");
        correctedInput = correctedInput.replace(this.fancyQuote2, "\"");
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
        let sanitizedInput = this.escapeMySQLInput(input);
        // Replace quotes with double quotes.
        sanitizedInput = sanitizedInput.replace(this.sanitizeSQL1, "\\'");
        // Trim off trailing
        sanitizedInput = sanitizedInput.replace(this.removeDanglingQuotes1, "");
        sanitizedInput = sanitizedInput.replace(this.removeDanglingQuotes2, "");
        return sanitizedInput;
    }
}
exports.StringUtility = StringUtility;
/** List of characters to trim from commands. */
StringUtility.charlist = [" ", "\"", "'"];
StringUtility.pattern = /(-?\d+)(\d{3})/;
StringUtility.fancyQuote1 = new RegExp("[" + ["‘", "’"] + "]+", "g");
StringUtility.fancyQuote2 = new RegExp("[" + ["“", "”"] + "]+", "g");
StringUtility.sanitizeSQL1 = new RegExp("(?:\\\\+'+)+", "g");
StringUtility.removeDanglingQuotes1 = new RegExp("[" + StringUtility.charlist + "]+$");
StringUtility.removeDanglingQuotes2 = new RegExp("^[" + StringUtility.charlist + "]+");
//# sourceMappingURL=StringUtility.js.map