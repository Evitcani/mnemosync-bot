import {injectable} from "inversify";
import {AbstractController} from "../Base/AbstractController";
import {Sending} from "../../entity/Sending";
import {Table} from "../../documentation/databases/Table";
import {World} from "../../entity/World";
import {NonPlayableCharacter} from "../../entity/NonPlayableCharacter";
import {Character} from "../../entity/Character";
import {Any, getConnection} from "typeorm";

@injectable()
export class SendingController extends AbstractController<Sending> {
    public static SENDING_LIMIT = 10;

    constructor() {
        super(Table.SENDING);
    }

    /**
     * Creates a new sending.
     *
     * @param sending
     */
    public async create(sending: Sending): Promise<Sending> {
        return this.getRepo().save(sending)
            .catch((err: Error) => {
                console.error("ERR ::: Could not create new sending.");
                console.error(err);
                return null;
            });
    }

    public async getByIds(ids: string[]): Promise<Sending[]> {
        // Not a valid argument.
        if (ids == null || ids.length < 1) {
            return null;
        }

        return this.getRepo().find({where: {id: Any(ids)}, relations: ["toNpc", "fromNpc", "toPlayer", "fromPlayer"]})
            .then((sending) => {
                // Check the party is valid.

                return sending;
            })
            .catch((err: Error) => {
                console.error("ERR ::: Could not get sendings.");
                console.error(err);
                return null;
            });
    }

    public async getOne(page: number, world: World, toNpc: NonPlayableCharacter, toPlayer: Character): Promise<Sending> {
        return this.getByParams(page, 1, world, toNpc, toPlayer).then((messages) => {
            if (messages == null || messages.length < 1) {
                return null;
            }

            return messages[0];
        });
    }

    public async get(page: number, world: World, toNpc: NonPlayableCharacter, toPlayer: Character): Promise<Sending[]> {
        return this.getByParams(page * SendingController.SENDING_LIMIT, SendingController.SENDING_LIMIT,
            world, toNpc, toPlayer);
    }

    private async getByParams(skip: number, limit: number,
                              world: World, toNpc: NonPlayableCharacter, toPlayer: Character): Promise<Sending[]> {
        let flag = false, sub;

        let query = getConnection().createQueryBuilder(Sending, "msg");

        if (world != null) {
            query = query.where(`"msg"."world_id" = '${world.id}'`);
            flag = true;
        }

        if (toNpc != null) {
            sub = `"msg"."to_npc_id" = '${toNpc.id}'`;
            if (flag) {
                query = query.andWhere(sub);
            } else {
                query = query.where(sub);
            }
            flag = true;
        }

        if (toPlayer != null) {
            sub = `"msg"."to_player_id" = ${toPlayer.id}`;
            if (flag) {
                query = query.andWhere(sub);
            } else {
                query = query.where(sub);
            }
            flag = true;
        }

        // Nothing to see here.
        if (!flag) {
            console.log("No world, character or NPC provided.");
            return null;
        }

        // Add final touches.
        query = query
            .andWhere(`("msg"."is_replied" IS NULL OR "msg"."is_replied" IS FALSE)`)
            .addSelect(["id"])
            .addOrderBy("\"msg\".\"created_date\"", "ASC")
            .limit(limit)
            .skip(skip);

        console.debug(query);

        return query
            .getMany().then((messages) => {
                if (!messages || messages.length < 1) {
                    return null;
                }
                let input : string[] = [], i;
                // Put into a map
                for (i = 0; i < messages.length; i++) {
                    input[i] = messages[i].id;
                }

                return this.getByIds(input);
            })
            .catch((err: Error) => {
                console.error("ERR ::: Could not get any sendings.");
                console.error(err);
                return null;
            });
    }
}