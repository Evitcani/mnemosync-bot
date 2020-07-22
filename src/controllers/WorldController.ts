import {AbstractController} from "./Base/AbstractController";
import {World} from "../entity/World";
import {Table} from "../documentation/databases/Table";
import {injectable} from "inversify";

@injectable()
export class WorldController extends AbstractController<World> {
    /**
     * Constructs this controller.
     */
    constructor() {
        super(Table.WORLD);
    }

    /**
     * Creates a new world.
     *
     * @param world The world to create.
     */
    public async create(world: World): Promise<World> {
        return this.getRepo().save(world)
            .catch((err: Error) => {
                console.error("ERR ::: Could not create new world.");
                console.error(err);
                return null;
            });
    }
}