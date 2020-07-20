const SqlString = require('sqlstring');

export class StringUtility {
    /** List of characters to trim from commands. */
    private static readonly charlist = [" ", "\"", "'"];
    private static pattern = /(-?\d+)(\d{3})/;

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
        let correctedInput = input.replace(new RegExp("[" + ["‘", "’"] + "]+"), "'");
        correctedInput = input.replace(new RegExp("[" + ["“", "”"] + "]+"), "\"");
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
        let sanitizedInput = StringUtility.escapeMySQLInput(input);

        // Trim off trailing
        sanitizedInput = sanitizedInput.replace(new RegExp("[" + this.charlist + "]+$"), "");
        sanitizedInput = sanitizedInput.replace(new RegExp("^[" + this.charlist + "]+"), "");

        return sanitizedInput;
    }
}