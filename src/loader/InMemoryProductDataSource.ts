// src/loader/InMemoryProductDataSource.ts
import { ConcreteMix } from "../models/inventory/ConcreteMix";
import { Product } from "../models/inventory/Product";
import { Supplier } from "../models/Supplier/Supplier";
import { SupplierRepository } from "../repository/SupplierRepository";
import { IProductDataSource } from "../types/datasource";
import { baseProductsData } from "../mockData";

/*
 * This in-memory data source simulates persistent storage for products.
 * allowing easy testing and separation of concerns without external dependencies.
 * In a real application, this would be replaced with a database or an API.
 */
export class InMemoryProductDataSource implements IProductDataSource {
  constructor(private supplierRepository: SupplierRepository) {}

  loadProducts(): Product[] {
    const supplier = this.supplierRepository.getById("supplier-123");
    if (!supplier) {
      throw new Error("Supplier not found");
    }

    return baseProductsData.map((data) => {
      return new ConcreteMix(
        supplier,
        data.id,
        supplier.getId(),
        data.name,
        data.description,
        "Concrete",
        data.basePrice,
        data.currentStock,
        data.maximumStockLevel,
        data.minimumStockThreshold
      );
    });
  }
}
