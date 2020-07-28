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
exports.CalendarMoonPhase = void 0;
const typeorm_1 = require("typeorm");
const CalendarMoon_1 = require("./CalendarMoon");
const StringUtility_1 = require("../utilities/StringUtility");
const Table_1 = require("../documentation/databases/Table");
let CalendarMoonPhase = class CalendarMoonPhase {
    purifyInsertUpdate() {
        this.name = StringUtility_1.StringUtility.escapeSQLInput(this.name);
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], CalendarMoonPhase.prototype, "id", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ name: "created_date" }),
    __metadata("design:type", Date)
], CalendarMoonPhase.prototype, "createdDate", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ name: "updated_date" }),
    __metadata("design:type", Date)
], CalendarMoonPhase.prototype, "updatedDate", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], CalendarMoonPhase.prototype, "name", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], CalendarMoonPhase.prototype, "order", void 0);
__decorate([
    typeorm_1.Column({ name: "viewing_angle_start" }),
    __metadata("design:type", Number)
], CalendarMoonPhase.prototype, "viewingAngleStart", void 0);
__decorate([
    typeorm_1.Column({ name: "viewing_angle_end" }),
    __metadata("design:type", Number)
], CalendarMoonPhase.prototype, "viewingAngleEnd", void 0);
__decorate([
    typeorm_1.ManyToOne(type => CalendarMoon_1.CalendarMoon, moon => moon.phases, {
        cascade: true
    }),
    typeorm_1.JoinColumn({ name: "calendar_moon_id" }),
    __metadata("design:type", CalendarMoon_1.CalendarMoon)
], CalendarMoonPhase.prototype, "moon", void 0);
__decorate([
    typeorm_1.BeforeInsert(),
    typeorm_1.BeforeUpdate(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CalendarMoonPhase.prototype, "purifyInsertUpdate", null);
CalendarMoonPhase = __decorate([
    typeorm_1.Entity({ name: Table_1.Table.MOON_PHASE })
], CalendarMoonPhase);
exports.CalendarMoonPhase = CalendarMoonPhase;
//# sourceMappingURL=CalendarMoonPhase.js.map