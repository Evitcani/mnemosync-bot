import {CommandStrut} from "./CommandStrut";

export class Subcommands {
    public static CREATE = new CommandStrut("create", "cr");
    public static DATE = new CommandStrut("date", "dt");
    public static DONJON = new CommandStrut("donjon", "donj");
    public static DRINKS = new CommandStrut("drinks", null);
    public static EATS = new CommandStrut("eats", null);
    public static FROM = new CommandStrut("from", null);
    public static FROM_NPC = new CommandStrut("from-npc", "fromn");
    public static GET = new CommandStrut("get", "g");
    public static IMG_URL = new CommandStrut("image-url", "img");
    public static NAME = new CommandStrut("name", "nm");
    public static NEXT = new CommandStrut("next", "n");
    public static NICKNAME = new CommandStrut("nickname", "nick");
    public static NPC = new CommandStrut("npc", null);
    public static MESSAGE = new CommandStrut("message", "msg");
    public static PARTY = new CommandStrut("party", "pt");
    public static READ = new CommandStrut("read", null);
    public static REPLY = new CommandStrut("reply", null);
    public static SWITCH = new CommandStrut("switch", "sw");
    public static TO = new CommandStrut("to", null);
    public static TO_NPC = new CommandStrut("to-npc", "ton");
    public static UPDATE = new CommandStrut("update", "upd");
    public static WEIGHT = new CommandStrut("weight", "wt");
    public static WEIGHT_INVENTORY = new CommandStrut("inventory-weight", "inv-wt");
    public static WORLD = new CommandStrut("world", null);
    public static WORLD_ANVIL = new CommandStrut("world-anvil", "wa");
    public static WORLD_ANVIL_CELESTIALS = new CommandStrut("world-anvil-celestials", "wa-celestials");
}