// src/loader/InMemoryProductDataSource.ts
import { ConcreteMix } from "../models/inventory/ConcreteMix";
import { Product } from "../models/inventory/Product";
import { Supplier } from "../models/Supplier/Supplier";
import { IProductDataSource } from "../types/datasource";

/*
 * This in-memory data source simulates persistent storage for products.
 * allowing easy testing and separation of concerns without external dependencies.
 * In a real application, this would be replaced with a database or an API.
 */
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
