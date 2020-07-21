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
     * Processes the user input.
     *
     * @param input The input to process.
     */
    static processUserInput(input) {
        // Input is null, return null.
        if (input == null) {
            return null;
        }
        let sanitizedInput = this.replaceFancyQuotes(input);
        // Trim off trailing
        sanitizedInput = sanitizedInput.replace(this.removeDanglingQuotes1, "");
        sanitizedInput = sanitizedInput.replace(this.removeDanglingQuotes2, "");
        return sanitizedInput;
    }
    /**
     * Escapes the given input to be placed in a database.
     *
     * @param input The input to escape.
     */
    static escapeMySQLInput(input) {
        return SqlString.escape(input);
    }
    /**
     * Escapes the SQL, without quoting the input.
     *
     * @param input The input to sanitize.
     */
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
        // Return the input.
        return sanitizedInput;
    }
    /**
     * Format the fund input. Makes it easier to process.
     *
     * @param input The input to format.
     */
    static formatFundInput(input) {
        if (input == null) {
            return null;
        }
        // Replace.
        let formattedInput = input.replace(this.formatGold, " gold ");
        formattedInput = formattedInput.replace(this.formatCopper, " copper ");
        formattedInput = formattedInput.replace(this.formatSilver, " silver ");
        formattedInput = formattedInput.replace(this.formatPlatinum, " platinum ");
        // Trim off trailing
        formattedInput = formattedInput.replace(this.removeDanglingQuotes1, "");
        formattedInput = formattedInput.replace(this.removeDanglingQuotes2, "");
        return formattedInput;
    }
}
exports.StringUtility = StringUtility;
/** List of characters to trim from commands. */
StringUtility.charList = [" ", "\"", "'"];
/** Pattern for inserting quotes into numbers. */
StringUtility.pattern = /(-?\d+)(\d{3})/;
/** The fancy apostrophes to strip. */
StringUtility.fancyQuote1 = new RegExp("[" + ["‘", "’"] + "]+", "g");
/** The fancy quotes to strip. */
StringUtility.fancyQuote2 = new RegExp("[" + ["“", "”"] + "]+", "g");
/** Used for keeping  */
StringUtility.sanitizeSQL1 = new RegExp("[\\\\']*(?:\\\\+'+)+[\\\\']*", "g");
/** Removes any dangling quotes. */
StringUtility.removeDanglingQuotes1 = new RegExp("^[" + StringUtility.charList + "]+");
StringUtility.removeDanglingQuotes2 = new RegExp("[" + StringUtility.charList + "]+$");
/** Used for formatting gold. */
StringUtility.formatGold = new RegExp("(\\s|)g\\S*(\\s|$){0,1}", "gi");
/** Used for formatting gold. */
StringUtility.formatCopper = new RegExp("(\\s|)c\\S*(\\s|$){0,1}", "gi");
/** Used for formatting gold. */
StringUtility.formatSilver = new RegExp("(\\s|)s\\S*(\\s|$){0,1}", "gi");
/** Used for formatting gold. */
StringUtility.formatPlatinum = new RegExp("(\\s|)p\\S*(\\s|$){0,1}", "gi");
//# sourceMappingURL=StringUtility.js.map