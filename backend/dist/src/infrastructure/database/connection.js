"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectionDb = void 0;
const typeorm_1 = require("typeorm");
const coupon_1 = require("./orm-entities/coupon");
exports.connectionDb = new typeorm_1.DataSource({
    type: 'better-sqlite3',
    database: process.env.DATABASE_NAME || 'database.sqlite',
    synchronize: true,
    entities: [coupon_1.Coupon],
});
