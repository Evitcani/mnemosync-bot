"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarMoon = void 0;
const typeorm_1 = require("typeorm");
const Calendar_1 = require("./Calendar");
const Table_1 = require("../documentation/databases/Table");
/**
 * day = number of days as time goes on
 PlanetPeriod = number of days in planet's year
 Moon1Period = number of days in moon1 cycle
 Moon2Period = number of days in moon2 cycle

 Col 1: Angle of planet relative to sun = (day MOD PlanetPeriod) * (360/PlanetPeriod)
 Col 2: Angle of moon1 relative to planet = (day MOD Moon1Period) * (360/Moon1Period)
 Col 3: Angle of moon2 relative to planet = (day MOD Moon2Period) * (360/Moon2Period)
 Col 4: Viewing Angle of Moon1 = Col2 minus Col1
 Col 5: Viewing Angle of Moon2 = Col3 minus Col1

 The Viewing Angle will tell you what phase the moon is in. A Viewing Angle of 0 degrees is a full moon. Viewing angle
 of 90 degrees is a first quarter moon. 180 degrees is a new moon. Etc, through 360.
 */
let CalendarMoon = class CalendarMoon {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], CalendarMoon.prototype, "id", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ name: "created_date" }),
    __metadata("design:type", Date)
], CalendarMoon.prototype, "createdDate", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ name: "updated_date" }),
    __metadata("design:type", Date)
], CalendarMoon.prototype, "updatedDate", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], CalendarMoon.prototype, "name", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], CalendarMoon.prototype, "cycle", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], CalendarMoon.prototype, "shift", void 0);
__decorate([
    typeorm_1.Column({ name: "calendar_id" }),
    __metadata("design:type", String)
], CalendarMoon.prototype, "calendarId", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Calendar_1.Calendar, calendar => calendar.moons, {
        cascade: true
    }),
    typeorm_1.JoinColumn({ name: "calendar_id" }),
    __metadata("design:type", Calendar_1.Calendar)
], CalendarMoon.prototype, "calendar", void 0);
CalendarMoon = __decorate([
    typeorm_1.Entity({ name: Table_1.Table.MOON })
], CalendarMoon);
exports.CalendarMoon = CalendarMoon;
//# sourceMappingURL=CalendarMoon.js.map