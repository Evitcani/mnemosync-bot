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
        let flag = false;

        let query = this.getRepo().createQueryBuilder("msg");

        if (world != null) {
            flag = true;
            query = query.where(`"msg"."worldId" = ${world.id}`);
        }

        if (toNpc != null) {
            flag = true;
            query = query.where(`"msg"."toNpcId" = ${toNpc.id}`);
        }

        if (toPlayer != null) {
            flag = true;
            query = query.where(`"msg"."toPlayerId" = ${toPlayer.id}`);
        }

        // Nothing to see here.
        if (!flag) {
            console.log("No world, character or NPC provided.");
            return null;
        }

        // Add final touches.
        query = query
            .andWhere(`("msg"."isReplied" IS NULL OR "msg"."isReplied" IS FALSE)`)
            .addOrderBy("createdDate", "ASC")
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