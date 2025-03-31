// ConcreteMix.ts
import { Product } from "./Product";
import { Supplier } from "../Supplier/Supplier";

export class ConcreteMix extends Product {
  constructor(
    id: string,
    name: string,
    description: string,
    category: string,
    basePrice: number,
    currentStock: number,
    minimumStockThreshold: number,
    suppliers: Array<{ supplier: Supplier; price: number }>
  ) {
    super(
      id,
      name,
      description,
      category,
      basePrice,
      currentStock,
      minimumStockThreshold,
      suppliers
    );
  }
}
