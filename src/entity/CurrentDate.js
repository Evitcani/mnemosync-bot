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
exports.CurrentDate = void 0;
const typeorm_1 = require("typeorm");
const GameDate_1 = require("./GameDate");
const Party_1 = require("./Party");
const Calendar_1 = require("./Calendar");
const Table_1 = require("../shared/documentation/databases/Table");
let CurrentDate = class CurrentDate {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], CurrentDate.prototype, "id", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ name: "created_date" }),
    __metadata("design:type", Date)
], CurrentDate.prototype, "createdDate", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ name: "updated_date" }),
    __metadata("design:type", Date)
], CurrentDate.prototype, "updatedDate", void 0);
__decorate([
    typeorm_1.Column(type => GameDate_1.GameDate),
    __metadata("design:type", GameDate_1.GameDate)
], CurrentDate.prototype, "date", void 0);
__decorate([
    typeorm_1.Column({ name: "calendar_id", nullable: true }),
    __metadata("design:type", String)
], CurrentDate.prototype, "calendarId", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Calendar_1.Calendar, {
        onDelete: "SET NULL",
        eager: true,
        nullable: true
    }),
    typeorm_1.JoinColumn({ name: "calendar_id" }),
    __metadata("design:type", Calendar_1.Calendar)
], CurrentDate.prototype, "calendar", void 0);
__decorate([
    typeorm_1.OneToOne(type => Party_1.Party, party => party.currentDate, {
        cascade: true
    }),
    __metadata("design:type", Party_1.Party)
], CurrentDate.prototype, "party", void 0);
CurrentDate = __decorate([
    typeorm_1.Entity({ name: Table_1.Table.CURRENT_DATE })
], CurrentDate);
exports.CurrentDate = CurrentDate;
//# sourceMappingURL=CurrentDate.js.map