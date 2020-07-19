import {CommandStrut} from "./CommandStrut";

export class Subcommands {
    public static CREATE = new CommandStrut("create", "cr");
    public static DRINKS = new CommandStrut("drinks", null);
    public static EATS = new CommandStrut("eats", null);
    public static IMG_URL = new CommandStrut("image-url", "img");
    public static PARTY = new CommandStrut("party", "pt");
    public static SWITCH = new CommandStrut("switch", "sw");
    public static UPDATE = new CommandStrut("update", "upd");
    public static WEIGHT = new CommandStrut("weight", "wt");
    public static WEIGHT_INVENTORY = new CommandStrut("inventory-weight", "inv-wt");
}