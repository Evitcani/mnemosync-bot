/**
 * A subcommand of the command.
 */
export class Subcommand {
    /** The name of the command or flag. */
    protected readonly name: string;
    /** The input given by the user. */
    protected readonly input: string | null;

    public constructor(name: string, input: string | null) {
        this.name = name;
        this.input = input;
    }

    /**
     * Gets the name of this command.
     */
    public getName(): string {
        return this.name;
    }

    /**
     * Gets the input provided by the user, if there is one.
     */
    public getInput(): string | null {
        return this.input;
    }
}