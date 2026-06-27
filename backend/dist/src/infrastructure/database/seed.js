"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const connection_1 = require("./connection");
const coupon_1 = require("./orm-entities/coupon");
const counpon_types_1 = require("../../domain/types/counpon.types");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const seeds = [
    {
        couponCode: "DESCONTO10",
        discountType: counpon_types_1.Etype.PERCENTAGE,
        discountValue: 10,
        minimumValue: 0,
        expireOnData: new Date("2099-12-31"),
        usageLimit: 100,
        status: counpon_types_1.ECouponStatus.ACTIVE,
    },
    {
        couponCode: "FIXO50",
        discountType: counpon_types_1.Etype.FIXED,
        discountValue: 50,
        minimumValue: 100,
        expireOnData: new Date("2099-12-31"),
        usageLimit: 100,
        status: counpon_types_1.ECouponStatus.ACTIVE,
    },
];
function runSeed() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Conectando ao banco:', process.env.DATABASE_NAME);
        yield connection_1.connectionDb.initialize();
        const repo = connection_1.connectionDb.getRepository(coupon_1.Coupon);
        for (const seed of seeds) {
            const exists = yield repo.findOne({ where: { couponCode: seed.couponCode } });
            if (!exists) {
                yield repo.save(repo.create(seed));
                console.log(`Criado: ${seed.couponCode}`);
            }
            else {
                console.log(`Já existe: ${seed.couponCode}`);
            }
        }
        yield connection_1.connectionDb.destroy();
        console.log('Seed finalizado.');
    });
}
runSeed().catch(console.error);
