// src/loader/InMemoryProductDataSource.ts
import { ConcreteMix } from "../models/inventory/ConcreteMix";
import { Product } from "../models/inventory/Product";
import { Supplier } from "../models/Supplier/Supplier";
import { IProductDataSource } from "../types/datasource";

export class InMemoryProductDataSource implements IProductDataSource {
  private products: Product[] = [
    new ConcreteMix(
      new Supplier("supplier-123", "Concrete Suppliers Ltd.", 120),
      "product-001",
      "supplier-123",
      "Concrete Mix",
      "High-quality concrete mix",
      "RAW_MATERIAL",
      10, // base price
      50, // current stock
      50, // max stock level
      10 // min stock threshold
    ),
  ];

  loadProducts(): Product[] {
    return this.products;
  }
}
