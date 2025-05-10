import { Supplier } from "../models/Supplier/Supplier";

export class InMemorySupplierDataSource {
  private suppliers: Supplier[] = [
    new Supplier("supplier-123", "Concrete Suppliers Ltd.", 120),
    new Supplier("supplier-456", "Steel Suppliers Inc.", 100),
  ];

  loadSuppliers(): Supplier[] {
    return this.suppliers;
  }
}
