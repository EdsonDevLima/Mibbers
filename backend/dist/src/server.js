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
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const connection_1 = require("./infrastructure/database/connection");
const counpon_routes_1 = require("./http/routes/counpon.routes");
dotenv_1.default.config();
const app = (0, fastify_1.default)();
app.register(cors_1.default, {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
});
app.register(counpon_routes_1.couponRoutes, { prefix: '/coupons' });
const port = parseInt(process.env.PORT) || 3001;
const host = process.env.HOST || '0.0.0.0';
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield connection_1.connectionDb.initialize();
            yield app.listen({ port, host });
            console.log(`servidor iniciado http://localhost:${port}`);
        }
        catch (error) {
            console.error(error);
            process.exit(1);
        }
    });
}
bootstrap();
