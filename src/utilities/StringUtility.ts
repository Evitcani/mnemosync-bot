const SqlString = require('sqlstring');

export class StringUtility {
    /** List of characters to trim from commands. */
    private static readonly charList = [" ", "\"", "'"];
    /** Pattern for inserting quotes into numbers. */
    private static pattern = /(-?\d+)(\d{3})/;
    /** The fancy apostrophes to strip. */
    private static fancyQuote1 = new RegExp("[" + ["‘", "’"] + "]+", "g");
    /** The fancy quotes to strip. */
    private static fancyQuote2 = new RegExp("[" + ["“", "”"] + "]+", "g");
    /** Used for keeping  */
    private static sanitizeSQL1 = new RegExp("[\\\\']*(?:\\\\+'+)+[\\\\']*", "g");
    /** Removes any dangling quotes. */
    private static removeDanglingQuotes1 = new RegExp("^[" + StringUtility.charList + "]+");
    private static removeDanglingQuotes2 = new RegExp("[" + StringUtility.charList + "]+$");
    /** Used for formatting gold. */
    private static formatGold = new RegExp("(\\s|)g\\S*(\\s|$){0,1}", "gi");
    /** Used for formatting gold. */
    private static formatCopper = new RegExp("(\\s|)c\\S*(\\s|$){0,1}", "gi");
    /** Used for formatting gold. */
    private static formatSilver = new RegExp("(\\s|)s\\S*(\\s|$){0,1}", "gi");
    /** Used for formatting gold. */
    private static formatPlatinum = new RegExp("(\\s|)p\\S*(\\s|$){0,1}", "gi");

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
     * Processes the user input.
     *
     * @param input The input to process.
     */
    static processUserInput(input: string): string {
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
    static escapeMySQLInput(input: any): string {
        return SqlString.escape(input);
    }

    /**
     * Escapes the SQL, without quoting the input.
     *
     * @param input The input to sanitize.
     */
    static escapeSQLInput(input: any): string {
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
    static formatFundInput (input: string): string {
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