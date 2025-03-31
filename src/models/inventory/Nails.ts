// ConcreteProduct.ts
import { Product } from "./Product";
import { Supplier } from "../Supplier/Supplier";
// Implementation of an abstract class Product
// This class represents nails (the building material) product in the system
export class NailsProduct extends Product {
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
