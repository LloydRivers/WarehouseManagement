// ConcreteProduct.ts
import { Product } from "../models/Product";
import { Supplier } from "../models/Supplier";

export class ConcreteProduct extends Product {
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
