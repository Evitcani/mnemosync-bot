import {injectable} from "inversify";
import {Message} from "discord.js";
import {CalendarRelatedResponses} from "../../../shared/documentation/client-responses/information/CalendarRelatedResponses";
import {CalendarDTO} from "../../api/dto/model/calendar/CalendarDTO";
import {API} from "../base/API";
import {DataDTO} from "../../api/dto/model/DataDTO";
import {APIConfig} from "../base/APIConfig";

@injectable()
export class CalendarController extends API {
    constructor() {
        super(APIConfig.GET());
    }

    protected async create(calendar: CalendarDTO): Promise<CalendarDTO> {
        let config = APIConfig.GET();
        let data: DataDTO = {};
        data.data = [];
        data.data.push(calendar);
        config.data = data;
        config.params = {
            world_id: calendar.worldId
        };

        return this.post(`/calendars`, config).then((res) => {
            console.log(res.data);
            // @ts-ignore
            return res.data.data;
        }).catch((err: Error) => {
            console.log("Caught error trying to create new current date for party.");
            console.error(err);
            return null;
        });
    }

    public async save(calendar: CalendarDTO): Promise<CalendarDTO> {
        if (!calendar.id) {
            return this.create(calendar);
        }

        let config = APIConfig.GET();
        let data: DataDTO = {};
        data.data = [];
        data.data.push(calendar);
        config.data = data;

        return this.put(`/calendars/${calendar.id}`, config).then((res) => {
            console.log(res.data);
            // @ts-ignore
            return res.data.data;
        }).catch((err: Error) => {
            console.log("Caught error trying to create new current date for party.");
            console.error(err);
            return null;
        });
    }

    public async getById(id: string): Promise<CalendarDTO> {
        return this.get(`/calendars/${id}`).then((res) => {
            console.log(res.data);
            // @ts-ignore
            return res.data.data;
        }).catch((err: Error) => {
            console.log("Caught error trying to create new current date for party.");
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
    public async getByName(calendarName: string, worldId: string): Promise<CalendarDTO[]> {
        let config = APIConfig.GET();
        config.params = {
            name: calendarName,
            world_id: worldId
        };

        return this.get(`/calendars`, config).then((res) => {
            console.log(res.data);
            // @ts-ignore
            return res.data.data;
        }).catch((err: Error) => {
            console.log("Caught error trying to create new current date for party.");
            console.error(err);
            return null;
        });
    }

    public async calendarSelection(calendars: CalendarDTO[], action: string, message: Message): Promise<CalendarDTO> {
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