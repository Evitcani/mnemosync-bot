import {AbstractController} from "../../Base/AbstractController";
import {Calendar} from "../../../entity/Calendar";
import {Table} from "../../../documentation/databases/Table";
import {injectable} from "inversify";
import {NameValuePair} from "../../Base/NameValuePair";
import {Message} from "discord.js";
import {CalendarRelatedResponses} from "../../../documentation/client-responses/information/CalendarRelatedResponses";

@injectable()
export class CalendarController extends AbstractController<Calendar> {
    constructor() {
        super(Table.CALENDAR);
    }

    public async save(calendar: Calendar): Promise<Calendar> {
        return this.getRepo().save(calendar);
    }

    public async get(id: string): Promise<Calendar> {
        return this.getRepo().findOne({
                where: {id: id},
                relations: ["eras", "months", "moons", "week"]
            })
            .catch((err: Error) => {
                console.error("ERR ::: Could not get calendars with given id.");
                console.error(err);
                return null;
            });
    }

    /**
     * Gets the calendar by name.
     *
     * @param calendarName The name of the calendar to find.
     * @param worldId The ID of the world the  calendar exists in.
     */
    public async getByName(calendarName: string, worldId: string): Promise<Calendar[]> {
        return this.getLikeArgs(
            [new NameValuePair("world_id", worldId)],
            [new NameValuePair("name", calendarName)])
            .catch((err: Error) => {
                console.error("ERR ::: Could not get calendars with given name.");
                console.error(err);
                return null;
            });
    }

    public async calendarSelection(calendars: Calendar[], action: string, message: Message): Promise<Calendar> {
        return message.channel.send(CalendarRelatedResponses.SELECT_CALENDAR(calendars, action)).then((msg) => {
            return message.channel.awaitMessages(m => m.author.id === message.author.id, {
                max: 1,
                time: 10e3,
                errors: ['time'],
            }).then((input) => {
                msg.delete({reason: "Removed calendar processing command."});
                let content = input.first().content;
                let choice = Number(content);
                if (isNaN(choice) || choice >= calendars.length || choice < 0) {
                    message.channel.send("Input doesn't make sense!");
                    return null;
                }

                input.first().delete();
                return calendars[choice];
            }).catch(()=> {
                msg.delete({reason: "Removed calendar processing command."});
                message.channel.send("Message timed out.");
                return null;
            });
        });
    }
}