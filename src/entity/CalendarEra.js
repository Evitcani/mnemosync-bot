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
exports.CalendarEra = void 0;
const typeorm_1 = require("typeorm");
const GameDate_1 = require("./GameDate");
const Table_1 = require("../documentation/databases/Table");
let CalendarEra = class CalendarEra {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], CalendarEra.prototype, "id", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ name: "created_date" }),
    __metadata("design:type", Date)
], CalendarEra.prototype, "createdDate", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ name: "updated_date" }),
    __metadata("design:type", Date)
], CalendarEra.prototype, "updatedDate", void 0);
__decorate([
    typeorm_1.Column({ name: "name" }),
    __metadata("design:type", String)
], CalendarEra.prototype, "name", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], CalendarEra.prototype, "order", void 0);
__decorate([
    typeorm_1.Column(type => GameDate_1.GameDate),
    __metadata("design:type", GameDate_1.GameDate)
], CalendarEra.prototype, "start", void 0);
__decorate([
    typeorm_1.Column(type => GameDate_1.GameDate),
    __metadata("design:type", GameDate_1.GameDate)
], CalendarEra.prototype, "end", void 0);
CalendarEra = __decorate([
    typeorm_1.Entity({ name: Table_1.Table.ERA })
], CalendarEra);
exports.CalendarEra = CalendarEra;
//# sourceMappingURL=CalendarEra.js.map