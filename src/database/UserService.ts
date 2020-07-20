import {DatabaseService} from "./base/DatabaseService";
import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {StringUtility} from "../utilities/StringUtility";
import {User} from "../entity/User";
import {DatabaseHelperService} from "./base/DatabaseHelperService";
import {Table} from "../documentation/databases/Table";
import {DbColumn} from "../models/database/schema/columns/DbColumn";
import {Column} from "../documentation/databases/Column";
import {DbTable} from "../models/database/schema/DbTable";
import {getManager, Repository} from "typeorm";
import {Character} from "../entity/Character";

@injectable()
export class UserService {
    private static TABLE_NAME = "users";
    /** Connection to the database object. */
    private databaseService: DatabaseService;

    constructor(@inject(TYPES.DatabaseService) databaseService: DatabaseService) {
        this.databaseService = databaseService;
    }

    private getRepo(): Repository<User> {
        return getManager().getRepository(User);
    }

    public async getUser(discordId: string, discordName: string): Promise<User> {
        return this.getRepo().findOne({where: {discord_id: discordId}}).then((user) => {
            if (!user) {
                return this.addUser(discordId, discordName);
            }

            if (discordName != user.discord_name) {
                user.discord_name = discordName;
                return this.updateUser(user).then(() => {
                    return user;
                });
            }

            return user;
        }).catch((err: Error) => {
            console.log(`ERROR: Could not get user (ID: ${discordId}). ::: ${err.message}`);
            console.log(err.stack);
            return null;
        });
    }



    /**
     * Registers a party to a given guild.
     *
     * @param discordId The ID of the user to register.
     * @param discordName The current discord name of the user to register.
     */
    private async addUser(discordId: string, discordName: string): Promise<User> {
        // Create the user.
        const user: User = new User();
        user.discord_id = discordId;
        user.discord_name = discordName;

        // Save the user.
        return this.getRepo().save(user).then((user) => {
            return user;
        }).catch((err: Error) => {
            console.log(`ERROR: Could add new user (Discord ID: ${discordId}). ::: ${err.message}`);
            console.log(err.stack);
            return null;
        });
    }

    public updateDefaultCharacter(discordId: string, discordName: string, character: Character): Promise<User> {
        return this.getUser(discordId, discordName).then((user) => {
            user.defaultCharacter = character;
            return this.updateUser(user);
        });
    }

    /**
     * Updates the default character and gets the updated user.
     *
     * @param user
     */
    public updateUser(user: User): Promise<User> {
        return this.getRepo().save(user).then((user) => {
            return user;
        });
    }
}