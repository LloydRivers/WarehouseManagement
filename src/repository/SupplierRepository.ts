import { InMemorySupplierDataSource } from "../loader/InMemorySupplierRepository";
import { Supplier } from "../models/Supplier/Supplier";

export class SupplierRepository {
  private dataSource: InMemorySupplierDataSource;

  constructor(dataSource: InMemorySupplierDataSource) {
    this.dataSource = dataSource;
  }

  private loadSuppliers(): Supplier[] {
    return this.dataSource.loadSuppliers();
  }

  getById(supplierId: string): Supplier | undefined {
    const suppliers = this.loadSuppliers();
    return suppliers.find((supplier) => supplier.getId() === supplierId);
  }

  update(updated: Supplier): void {
    const suppliers = this.loadSuppliers();
    const existingSupplier = suppliers.find(
      (existing) => existing.getId() === updated.getId()
    );
    if (!existingSupplier) {
      throw new Error("Cannot update non-existent supplier");
    }
    const index = suppliers.indexOf(existingSupplier);
    suppliers[index] = updated;
  }

  updateSupplierPrice(supplierId: string, newPrice: number): void {
    const supplier = this.getById(supplierId);
    if (!supplier) {
      throw new Error("Supplier not found");
    }

    supplier.setPrice(newPrice);
  }
}
