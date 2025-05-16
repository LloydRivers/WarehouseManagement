// src/models/inventory/Concrete.ts
import { Product } from "./Product";

export class ConcreteMix extends Product {
    calculateDiscountedPrice(discountRate: number): number {
        if (discountRate < 0 || discountRate > 1) {
            throw new Error("Discount rate must be between 0 and 1");
        }
        return this.getBasePrice() * (1 - discountRate);
    }
}
