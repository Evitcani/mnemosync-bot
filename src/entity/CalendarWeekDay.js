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
exports.CalendarWeekDay = void 0;
const typeorm_1 = require("typeorm");
const Calendar_1 = require("./Calendar");
const Table_1 = require("../shared/documentation/databases/Table");
const StringUtility_1 = require("../backend/utilities/StringUtility");
let CalendarWeekDay = class CalendarWeekDay {
    purifyInsertUpdate() {
        this.name = StringUtility_1.StringUtility.escapeSQLInput(this.name);
        this.description = StringUtility_1.StringUtility.escapeSQLInput(this.description);
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], CalendarWeekDay.prototype, "id", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ name: "created_date" }),
    __metadata("design:type", Date)
], CalendarWeekDay.prototype, "createdDate", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ name: "updated_date" }),
    __metadata("design:type", Date)
], CalendarWeekDay.prototype, "updatedDate", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], CalendarWeekDay.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], CalendarWeekDay.prototype, "description", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], CalendarWeekDay.prototype, "order", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Calendar_1.Calendar, calendar => calendar.week, {
        cascade: true
    }),
    typeorm_1.JoinColumn({ name: "calendar_id" }),
    __metadata("design:type", Calendar_1.Calendar)
], CalendarWeekDay.prototype, "calendar", void 0);
__decorate([
    typeorm_1.BeforeInsert(),
    typeorm_1.BeforeUpdate(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CalendarWeekDay.prototype, "purifyInsertUpdate", null);
CalendarWeekDay = __decorate([
    typeorm_1.Entity({ name: Table_1.Table.WEEK_DAY })
], CalendarWeekDay);
exports.CalendarWeekDay = CalendarWeekDay;
//# sourceMappingURL=CalendarWeekDay.js.map