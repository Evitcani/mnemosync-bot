import {CommandStrut} from "./CommandStrut";
import {Commands} from "./Commands";

export class Subcommands {
    public static CREATE = new CommandStrut("create", "cr", new Map<string, string>()
        .set(Commands.DATE, "calendar existing name")
        .set(Commands.CHARACTER, "name of new character")
        .set(Commands.WORLD, "name of new world"));
    public static DATE = new CommandStrut("date", "dt", new Map<string, string>()
        .set(Commands.DATE, "(# day)/(# month)/(# year)")
        .set(Commands.SENDING, "(# day)/(# month)/(# year)"));
    public static DONJON = new CommandStrut("donjon", "donj", new Map<string, string>()
        .set(Commands.CALENDAR, "json from donjon export"));
    public static DRINKS = new CommandStrut("drinks", null, new Map<string, string>());
    public static EATS = new CommandStrut("eats", null, new Map<string, string>());
    public static FROM = new CommandStrut("from", null, new Map<string, string>()
        .set(Commands.SENDING, "name of NPC character"));
    public static GET = new CommandStrut("get", "g", new Map<string, string>());
    public static IMG_URL = new CommandStrut("image-url", "img", new Map<string, string>()
        .set(Commands.CHARACTER, "url for an image to display"));
    public static NAME = new CommandStrut("name", "nm", new Map<string, string>()
        .set(Commands.CALENDAR, "name for new calendar"));
    public static NEXT = new CommandStrut("next", "n", new Map<string, string>()
        .set(Commands.WHICH, "number of page to go to"));
    public static NICKNAME = new CommandStrut("nickname", "nick", new Map<string, string>()
        .set(Commands.CHARACTER, "nickname for character"));
    public static NPC = new CommandStrut("npc", null, new Map<string, string>());
    public static MESSAGE = new CommandStrut("message", "msg", new Map<string, string>()
        .set(Commands.SENDING, "message content"));
    public static PARTY = new CommandStrut("party", "pt", new Map<string, string>()
        .set(Commands.REGISTER, "new party name")
        .set(Commands.DATE, "existing party name")
        .set(Commands.WORLD, "existing party name"));
    public static READ = new CommandStrut("read", null, new Map<string, string>());
    public static REPLY = new CommandStrut("reply", null, new Map<string, string>()
        .set(Commands.SENDING, "# id of message"));
    public static SWITCH = new CommandStrut("switch", "sw", new Map<string, string>()
        .set(Commands.CHARACTER, "existing character name | none to remove default")
        .set(Commands.PARTY, "existing party name | none to remove default")
        .set(Commands.WORLD, "existing world name | none to remove default"));
    public static TO = new CommandStrut("to", null, new Map<string, string>()
        .set(Commands.SENDING, "player character name"));
    public static TO_NPC = new CommandStrut("to-npc", "ton", new Map<string, string>()
        .set(Commands.SENDING, "NPC name"));
    public static UPDATE = new CommandStrut("update", "upd", new Map<string, string>()
        .set("", ""));
    public static WEIGHT = new CommandStrut("weight", "wt", new Map<string, string>()
        .set("", ""));
    public static WEIGHT_INVENTORY = new CommandStrut("inventory-weight", "inv-wt", new Map<string, string>()
        .set("", ""));
    public static WORLD = new CommandStrut("world", null, new Map<string, string>()
        .set("", ""));
    public static WORLD_ANVIL = new CommandStrut("world-anvil", "wa", new Map<string, string>()
        .set(Commands.CALENDAR, "json from World Anvil calendar export"));
}