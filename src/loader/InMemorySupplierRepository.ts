import { Supplier } from "../models/Supplier/Supplier";

/*
 * This in-memory data source simulates persistent storage for suppliers.
 * allowing easy testing and separation of concerns without external dependencies.
 * In a real application, this would be replaced with a database or an API.
 */
export class InMemorySupplierDataSource {
  private suppliers: Supplier[] = [
    new Supplier("supplier-123", "Concrete Suppliers Ltd.", 120),
    new Supplier("supplier-456", "Steel Suppliers Inc.", 100),
  ];

  loadSuppliers(): Supplier[] {
    return this.suppliers;
  }
}
