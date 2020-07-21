const SqlString = require('sqlstring');

export class StringUtility {
    /** List of characters to trim from commands. */
    private static readonly charlist = [" ", "\"", "'"];
    private static pattern = /(-?\d+)(\d{3})/;
    private static fancyQuote1 = new RegExp("[" + ["‘", "’"] + "]+", "g");
    private static fancyQuote2 = new RegExp("[" + ["“", "”"] + "]+", "g");
    private static sanitizeSQL1 = new RegExp("(?:\\\\+'+)+", "g");
    private static removeDanglingQuotes1 = new RegExp("[" + StringUtility.charlist + "]+$");
    private static removeDanglingQuotes2 = new RegExp("^[" + StringUtility.charlist + "]+");

    /**
     * A utility to format numbers with commas. Works extra quickly.
     *
     * @param input The number to format with commas.
     */
    static numberWithCommas(input: number) : string {
        let str = input.toString();
        while (this.pattern.test(str))
            str = str.replace(this.pattern, "$1,$2");
        return str;
    }

    static replaceFancyQuotes(input: string): string {
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
    static escapeMySQLInput(input: string): string {
        return SqlString.escape(input);
    }

    static escapeSQLInput(input: string): string {
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