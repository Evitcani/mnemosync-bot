import {injectable} from "inversify";
import {Message} from "discord.js";
import {API} from "../base/API";
import {APIConfig} from "../base/APIConfig";
import {messageTypes} from "../../../shared/documentation/messages/MessageTypes";
import {CalendarDTO} from "@evitcani/mnemoshared/dist/src/dto/model/calendar/CalendarDTO";

@injectable()
export class CalendarController extends API<CalendarDTO> {
    constructor() {
        super(APIConfig.GET());
    }

    protected async create(calendar: CalendarDTO): Promise<CalendarDTO> {
        let params = {
            world_id: calendar.worldId
        };
        return super.create(calendar, `/calendars`, params);
    }

    public async save(calendar: CalendarDTO): Promise<CalendarDTO> {
        let params = {
            world_id: calendar.worldId
        };
        return super.save(calendar, `/calendars/${calendar.id}`, params);
    }

    public async getById(id: string): Promise<CalendarDTO> {
        return super.getByParams(`/calendars/${id}`);
    }

    /**
     * Gets the calendar by name.
     *
     * @param calendarName The name of the calendar to find.
     * @param worldId The ID of the world the  calendar exists in.
     */
    public async getByName(calendarName: string, worldId: string): Promise<CalendarDTO[]> {
        let params = {
            name: calendarName,
            world_id: worldId
        };

        return super.getAll(`/calendars`, params);
    }

    public async calendarSelection(calendars: CalendarDTO[], action: string, message: Message): Promise<CalendarDTO> {
        return this.selection(calendars, action, messageTypes.calendar, message);
    }
}