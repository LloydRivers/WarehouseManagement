// src/loader/InMemoryProductDataSource.ts
import { ConcreteMix } from "../models/inventory/ConcreteMix";
import { Product } from "../models/inventory/Product";
import { Supplier } from "../models/Supplier/Supplier";
import { IProductDataSource } from "../types/datasource";
export const suppliers = [
  new Supplier("supplier-123", "Concrete Suppliers Ltd."),
];
export class InMemoryProductDataSource implements IProductDataSource {
  private products: Product[] = [
    new ConcreteMix(
      "product-001",
      "Concrete Mix",
      "High-quality concrete mix",
      "RAW_MATERIAL",
      100, // base price
      50, // stock
      10, // min stock threshold
      [{ supplier: suppliers[0], price: 120 }]
    ),
  ];

  loadProducts(): Product[] {
    return this.products;
  }
}
