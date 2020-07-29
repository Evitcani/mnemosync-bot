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
exports.Calendar = void 0;
const typeorm_1 = require("typeorm");
const World_1 = require("./World");
const CalendarMonth_1 = require("./CalendarMonth");
const CalendarWeekDay_1 = require("./CalendarWeekDay");
const CalendarMoon_1 = require("./CalendarMoon");
const CalendarEra_1 = require("./CalendarEra");
const GameDate_1 = require("./GameDate");
const Table_1 = require("../shared/documentation/databases/Table");
const StringUtility_1 = require("../backend/utilities/StringUtility");
let Calendar = class Calendar {
    purifyInsertUpdate() {
        this.name = StringUtility_1.StringUtility.escapeSQLInput(this.name);
        this.description = StringUtility_1.StringUtility.escapeSQLInput(this.description);
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Calendar.prototype, "id", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ name: "created_date" }),
    __metadata("design:type", Date)
], Calendar.prototype, "createdDate", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ name: "updated_date" }),
    __metadata("design:type", Date)
], Calendar.prototype, "updatedDate", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Calendar.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ name: "year_length_days" }),
    __metadata("design:type", Number)
], Calendar.prototype, "yearLength", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], Calendar.prototype, "description", void 0);
__decorate([
    typeorm_1.Column(type => GameDate_1.GameDate),
    __metadata("design:type", GameDate_1.GameDate)
], Calendar.prototype, "epoch", void 0);
__decorate([
    typeorm_1.Column({ name: "world_id" }),
    __metadata("design:type", String)
], Calendar.prototype, "worldId", void 0);
__decorate([
    typeorm_1.ManyToOne(type => World_1.World, {
        cascade: true
    }),
    typeorm_1.JoinColumn({ name: "world_id" }),
    __metadata("design:type", World_1.World)
], Calendar.prototype, "world", void 0);
__decorate([
    typeorm_1.OneToMany(type => CalendarEra_1.CalendarEra, era => era.calendar, {
        onDelete: "SET NULL",
        nullable: true
    }),
    __metadata("design:type", Array)
], Calendar.prototype, "eras", void 0);
__decorate([
    typeorm_1.OneToMany(type => CalendarMonth_1.CalendarMonth, month => month.calendar, {
        onDelete: "SET NULL",
        nullable: true
    }),
    __metadata("design:type", Array)
], Calendar.prototype, "months", void 0);
__decorate([
    typeorm_1.OneToMany(type => CalendarWeekDay_1.CalendarWeekDay, day => day.calendar, {
        onDelete: "SET NULL",
        nullable: true
    }),
    __metadata("design:type", Array)
], Calendar.prototype, "week", void 0);
__decorate([
    typeorm_1.OneToMany(type => CalendarMoon_1.CalendarMoon, moon => moon.calendar, {
        onDelete: "SET NULL",
        nullable: true
    }),
    __metadata("design:type", Array)
], Calendar.prototype, "moons", void 0);
__decorate([
    typeorm_1.BeforeInsert(),
    typeorm_1.BeforeUpdate(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Calendar.prototype, "purifyInsertUpdate", null);
Calendar = __decorate([
    typeorm_1.Entity({ name: Table_1.Table.CALENDAR })
], Calendar);
exports.Calendar = Calendar;
//# sourceMappingURL=Calendar.js.map