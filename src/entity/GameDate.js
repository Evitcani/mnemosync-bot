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
exports.GameDate = void 0;
const typeorm_1 = require("typeorm");
const CalendarEra_1 = require("./CalendarEra");
const Calendar_1 = require("./Calendar");
const Character_1 = require("./Character");
class GameDate {
}
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], GameDate.prototype, "day", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], GameDate.prototype, "month", void 0);
__decorate([
    typeorm_1.Column({ nullable: true }),
    __metadata("design:type", Number)
], GameDate.prototype, "year", void 0);
__decorate([
    typeorm_1.Column({ name: "era_id", nullable: true }),
    __metadata("design:type", String)
], GameDate.prototype, "eraId", void 0);
__decorate([
    typeorm_1.ManyToOne(type => CalendarEra_1.CalendarEra, {
        onDelete: "SET NULL",
        eager: true,
        nullable: true
    }),
    typeorm_1.JoinColumn({ name: "era_id" }),
    __metadata("design:type", CalendarEra_1.CalendarEra)
], GameDate.prototype, "era", void 0);
__decorate([
    typeorm_1.Column({ name: "calendar_id", nullable: true }),
    __metadata("design:type", String)
], GameDate.prototype, "calendarId", void 0);
__decorate([
    typeorm_1.OneToOne(type => Character_1.Character, character => character.travel_config, {
        cascade: true
    }),
    typeorm_1.JoinColumn({ name: "calendar_id" }),
    __metadata("design:type", Calendar_1.Calendar)
], GameDate.prototype, "calendar", void 0);
exports.GameDate = GameDate;
//# sourceMappingURL=GameDate.js.map