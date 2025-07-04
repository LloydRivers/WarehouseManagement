import { InMemorySupplierDataSource } from "../loader/InMemorySupplierRepository";
import { Supplier } from "../models/Supplier/Supplier";

export class SupplierRepository {
  private dataSource: InMemorySupplierDataSource;
  private suppliers: Supplier[];

  /**
   * Constructor using dependency injection pattern.
   */
  constructor(dataSource: InMemorySupplierDataSource) {
    this.dataSource = dataSource;
    this.suppliers = this.dataSource.loadSuppliers();
  }

  getById(supplierId: string): Supplier | undefined {
    return this.suppliers.find((supplier) => supplier.getId() === supplierId);
  }

  update(updated: Supplier): void {
    const index = this.suppliers.findIndex(
      (existing) => existing.getId() === updated.getId()
    );
    if (index === -1) {
      throw new Error("Cannot update non-existent supplier");
    }
    this.suppliers[index] = updated;
  }

  updateSupplierPrice(supplierId: string, newPrice: number): void {
    const supplier = this.getById(supplierId);
    if (!supplier) {
      throw new Error("Supplier not found");
    }
    supplier.setPrice(newPrice);
  }
  // Assignment Brief: Allow the user to view all suppliers in the system.
  getAll(): Supplier[] {
    return this.suppliers;
  }
}
