import {AbstractController} from "../Base/AbstractController";
import {NonPlayableCharacter} from "../../entity/NonPlayableCharacter";
import {Table} from "../../documentation/databases/Table";
import {injectable} from "inversify";
import {NameValuePair} from "../Base/NameValuePair";

@injectable()
export class NPCController extends AbstractController<NonPlayableCharacter> {
    /**
     * Constructs this controller.
     */
    constructor() {
        super(Table.NPC);
    }

    /**
     * Creates a new NPC.
     *
     * @param npc The NPC to create.
     */
    public async create(npc: NonPlayableCharacter): Promise<NonPlayableCharacter> {
        return this.getRepo().save(npc)
            .catch((err: Error) => {
                console.error("ERR ::: Could not create new NPC.");
                console.error(err);
                return null;
            });
    }

    public async getById(id: string): Promise<NonPlayableCharacter> {
        return this.getRepo().findOne({where: {id: id}, relations: ["world"]})
            .catch((err: Error) => {
                console.error("ERR ::: Could not get NPCs by id.");
                console.error(err);
                return null;
            });
    }

    public async getByWorld(worldId: string): Promise<NonPlayableCharacter[]> {
        return this.getRepo().find({where: {worldId: worldId}, relations: ["world"]})
            .catch((err: Error) => {
                console.error("ERR ::: Could not get NPCs in world.");
                console.error(err);
                return null;
            });
    }

    public async getByName(name: string, worldId: string): Promise<NonPlayableCharacter> {
        return this.getLikeArgs(
            [new NameValuePair("world_id", worldId)],
            [new NameValuePair("name", name)])
            .then((characters) => {
                if (characters == null || characters.length < 1) {
                    return null;
                }
                return characters[0];
            })
            .catch((err: Error) => {
                console.error("ERR ::: Could not get NPC by name.");
                console.error(err);
                return null;
            });
    }
}