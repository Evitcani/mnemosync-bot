import {AbstractController} from "./Base/AbstractController";
import {User} from "../entity/User";
import {Table} from "../documentation/databases/Table";
import {injectable} from "inversify";
import {Character} from "../entity/Character";
import {World} from "../entity/World";

@injectable()
export class UserController extends AbstractController<User> {
    /**
     * Construct this controller.
     */
    constructor() {
        super(Table.USER);
    }

    /**
     * Creates a new user.
     *
     * @param discordId The discord ID of the user.
     * @param discordName The discord name of user.
     */
    private async create(discordId: string, discordName: string): Promise<User> {
        const tempUser = new User();
        tempUser.discord_id = discordId;
        tempUser.discord_name = discordName;

        return this.getRepo().save(tempUser).catch((err: Error) => {
            console.error("ERR ::: Could not create new user.");
            console.error(err);
            return null;
        });
    }

    /**
     * Gets the user.
     *
     * @param discordId The discord ID of the user.
     * @param discordName The discord name of user.
     */
    public async get(discordId: string, discordName: string): Promise<User> {
        return this.getRepo().findOne({where: {discord_id: discordId}, relations: ["defaultCharacter"]})
            .then((user) => {
                if (!user) {
                    return this.create(discordId, discordName);
                }

                // Update the name, if needed.
                if (user.discord_name != discordName) {
                    user.discord_name = discordName;
                    return this.save(user);
                }

                return user;
            }).catch((err: Error) => {
                console.error("ERR ::: Could not get the user.");
                console.error(err);
                return null;
            });
    }

    /**
     * Updates the default character.
     *
     * @param user The user to update.
     * @param character The new character to make default.
     */
    public async updateDefaultCharacter(user: User, character: Character): Promise<User> {
        user.defaultCharacter = character;
        user.defaultCharacterId = character.id;
        return this.save(user);
    }

    /**
     * Updates the default characters.
     *
     * @param user The user to update.
     * @param world The new character to make default.
     */
    public async updateDefaultWorld(user: User, world: World): Promise<User> {
        if (world != null) {
            user.defaultWorld = world;
            user.defaultWorldId = world.id;
        } else {
            user.defaultWorld = null;
            user.defaultWorldId = null;
        }

        return this.save(user);
    }

    /**
     * Saves the user.
     *
     * @param user The user to save.
     */
    private async save(user: User): Promise<User> {
        return this.getRepo().save(user).catch((err: Error) => {
            console.error("ERR ::: Could not save the user.");
            console.error(err);
            return null;
        });
    }
}