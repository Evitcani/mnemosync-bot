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
exports.CalendarMonth = void 0;
const typeorm_1 = require("typeorm");
const Calendar_1 = require("./Calendar");
const Table_1 = require("../documentation/databases/Table");
const StringUtility_1 = require("../utilities/StringUtility");
let CalendarMonth = class CalendarMonth {
    purifyInsertUpdate() {
        this.name = StringUtility_1.StringUtility.escapeSQLInput(this.name);
        this.description = StringUtility_1.StringUtility.escapeSQLInput(this.description);
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], CalendarMonth.prototype, "id", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ name: "created_date" }),
    __metadata("design:type", Date)
], CalendarMonth.prototype, "createdDate", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ name: "updated_date" }),
    __metadata("design:type", Date)
], CalendarMonth.prototype, "updatedDate", void 0);
__decorate([
    typeorm_1.Column({ name: "name" }),
    __metadata("design:type", String)
], CalendarMonth.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", String)
], CalendarMonth.prototype, "description", void 0);
__decorate([
    typeorm_1.Column({ name: "length" }),
    __metadata("design:type", Number)
], CalendarMonth.prototype, "length", void 0);
__decorate([
    typeorm_1.Column({ name: "order" }),
    __metadata("design:type", Number)
], CalendarMonth.prototype, "order", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Calendar_1.Calendar, calendar => calendar.months, {
        cascade: true
    }),
    typeorm_1.JoinColumn({ name: "calendar_id" }),
    __metadata("design:type", Calendar_1.Calendar)
], CalendarMonth.prototype, "calendar", void 0);
__decorate([
    typeorm_1.BeforeInsert(),
    typeorm_1.BeforeUpdate(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CalendarMonth.prototype, "purifyInsertUpdate", null);
CalendarMonth = __decorate([
    typeorm_1.Entity({ name: Table_1.Table.MONTH })
], CalendarMonth);
exports.CalendarMonth = CalendarMonth;
//# sourceMappingURL=CalendarMonth.js.map