// src/loader/InMemoryProductDataSource.ts
import { ConcreteMix } from "../models/inventory/ConcreteMix";
import { Product } from "../models/inventory/Product";
import { Supplier } from "../models/Supplier/Supplier";
import { SupplierRepository } from "../repository/SupplierRepository";
import { IProductDataSource } from "../types/datasource";

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

    return [
      new ConcreteMix(
        //Argument of type 'Supplier | undefined' is not assignable to parameter of type 'Supplier'.
        // Type 'undefined' is not assignable to type 'Supplier'.ts(2345)
        supplier,
        "product-001",
        // 'supplier' is possibly 'undefined'.ts(18048)
        supplier.getId(),
        "Concrete Mix",
        "High-quality concrete mix",
        "RAW_MATERIAL",
        10, // base price
        50, // current stock
        50, // max stock levele
        10 // min stock threshold
      ),
    ];
  }
}
