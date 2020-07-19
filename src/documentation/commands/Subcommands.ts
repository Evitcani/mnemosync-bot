import {CommandStrut} from "./CommandStrut";

export class Subcommands {
    public static CREATE = new CommandStrut("create", "cr");
    public static PARTY = new CommandStrut("party", "pt");
    public static SWITCH = new CommandStrut("switch", "sw");
    public static UPDATE = new CommandStrut("update", "upd");
}