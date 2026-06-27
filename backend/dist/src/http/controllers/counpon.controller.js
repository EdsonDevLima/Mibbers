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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CounponController = void 0;
const coupon_use_cases_1 = require("../../aplication/useCases/coupon.use.cases");
class CounponController {
    constructor() {
        this.counponUseCases = new coupon_use_cases_1.CounponUseCases();
    }
    ApplyCounpon(Req, Rep) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { couponCode, productsList } = Req.body;
                const result = yield this.counponUseCases.ApplyCoupon({
                    couponCode,
                    productsList,
                });
                if (result.success == false) {
                    return Rep.status(400).send(result);
                }
                return Rep.status(200).send(result);
            }
            catch (error) {
                throw Error(`${error}`);
            }
        });
    }
}
exports.CounponController = CounponController;
