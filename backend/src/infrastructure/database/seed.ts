import "reflect-metadata"
import { connectionDb } from "./connection"
import { Coupon } from "./orm-entities/coupon"
import { ECouponStatus, Etype } from "../../domain/types/counpon-types"

const seeds: Partial<Coupon>[] = [
    {
        couponCode: "DESCONTO10",
        discountType: Etype.PERCENTAGE,
        discountValue: 10,
        minimumValue: 0,
        expireOnData: new Date("2099-12-31"),
        usageLimit: 100,
        status: ECouponStatus.ACTIVE,
    },
    {
        couponCode: "FIXO50",
        discountType: Etype.FIXED,
        discountValue: 50,
        minimumValue: 100,
        expireOnData: new Date("2099-12-31"),
        usageLimit: 100,
        status: ECouponStatus.ACTIVE,
    },
]

async function runSeed() {
    await connectionDb.initialize()
    const repo = connectionDb.getRepository(Coupon)

    for (const seed of seeds) {
        const exists = await repo.findOne({ where: { couponCode: seed.couponCode } })
        if (!exists) {
            await repo.save(repo.create(seed))
        } else {
            console.log(`Já existe: ${seed.couponCode}`)
        }
    }

    await connectionDb.destroy()
}

runSeed().catch(console.error)