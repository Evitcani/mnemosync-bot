import {injectable} from "inversify";
import {AbstractController} from "../Base/AbstractController";
import {Sending} from "../../entity/Sending";
import {Table} from "../../documentation/databases/Table";
import {World} from "../../entity/World";
import {NonPlayableCharacter} from "../../entity/NonPlayableCharacter";
import {Character} from "../../entity/Character";
import {Not} from "typeorm";

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

    public async get(page: number, world: World, toNpc: NonPlayableCharacter, toPlayer: Character): Promise<Sending[]> {
        let flag = false, sub;

        let query = this.getRepo().createQueryBuilder("msg");

        if (world != null) {
            query = query.where(`"msg"."world_id" = "${world.id}"`);
            flag = true;
        }

        if (toNpc != null) {
            sub = `"msg"."to_npc_id" = "${toNpc.id}"`;
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
            .andWhere(`("msg"."isReplied" IS NULL OR "msg"."isReplied" IS FALSE)`)
            .addOrderBy("\"msg\".\"created_date\"", "ASC")
            .limit(SendingController.SENDING_LIMIT)
            .skip(page * SendingController.SENDING_LIMIT);

        // Print query.
        console.debug("QUERY USED: " + query.getQuery());

        return query
            .getMany()
            .catch((err: Error) => {
                console.error("ERR ::: Could not get any sendings.");
                console.error(err);
                return null;
            });
    }
}