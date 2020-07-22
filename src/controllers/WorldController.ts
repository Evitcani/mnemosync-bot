import {AbstractController} from "./Base/AbstractController";
import {World} from "../entity/World";
import {Table} from "../documentation/databases/Table";
import {injectable} from "inversify";
import {NameValuePair} from "./Base/NameValuePair";
import {User} from "../entity/User";
import {StringUtility} from "../utilities/StringUtility";

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

    /**
     * Gets all parties in the given guild with a name similar.
     *
     * @param name The name of the world to get.
     * @param user
     */
    public getByNameAndUser(name: string, user: User): Promise<World[]> {
        let sanitizedName = StringUtility.escapeSQLInput(name);

        let query =this
            .getRepo()
            .createQueryBuilder(Table.USER)
            .innerJoin(
                `${Table.USER}.campaignsDMing`,
                `${this.tableName}`,
                `LOWER(${this.tableName}.name) LIKE LOWER('%${sanitizedName}%')`
            ).getQuery();

        console.log("QUERY: " + query);
        return this
            .getRepo()
            .createQueryBuilder(Table.USER)
            .innerJoin(
                `${Table.USER}.campaignsDMing`,
                `${this.tableName}`,
                `LOWER(${this.tableName}.name) LIKE LOWER('%${sanitizedName}%')`
            ).getMany().catch((err: Error) => {
            console.error("ERR ::: Could not get worlds.");
            console.error(err);
            return null;
        });
    }
}