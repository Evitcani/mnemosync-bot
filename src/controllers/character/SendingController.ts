import {injectable} from "inversify";
import {AbstractController} from "../Base/AbstractController";
import {Sending} from "../../entity/Sending";
import {Table} from "../../documentation/databases/Table";
import {World} from "../../entity/World";
import {NonPlayableCharacter} from "../../entity/NonPlayableCharacter";
import {Character} from "../../entity/Character";

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
        return this.getRepo().save(sending);
    }

    public async get(page: number, world: World, toNpc: NonPlayableCharacter, toPlayer: Character): Promise<Sending[]> {
        let flag = false;
        let where = {
            isReplied: false
        };

        if (world != null) {
            flag = true;
            // @ts-ignore
            where.worldId = world.id;
        }

        if (toNpc != null) {
            flag = true;
            // @ts-ignore
            where.toNpcId = toNpc.id;
        }

        if (toPlayer != null) {
            flag = true;
            // @ts-ignore
            where.toPlayer = toPlayer.id;
        }

        // Nothing to see here.
        if (!flag) {
            return null;
        }

        return this.getRepo().find({
            where: where,
            order: {
                createdDate: 'ASC'
            },
            cache: true,
            skip: page * SendingController.SENDING_LIMIT,
            take: SendingController.SENDING_LIMIT
        })
    }
}