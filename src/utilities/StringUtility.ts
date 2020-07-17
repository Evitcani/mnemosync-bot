import {SqlString} from 'sqlstring';

export class StringUtility {
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

    /**
     * Escapes the given input to be placed in a database.
     *
     * @param input The input to escape.
     */
    static escapeMySQLInput(input: string): string {
        return SqlString.escape(input);
    }
}