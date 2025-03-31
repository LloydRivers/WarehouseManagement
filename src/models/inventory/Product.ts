// src/models/Product.ts
// TODO: add some information about this class.
import { DomainError } from "../../utils/Error";
import { Supplier } from "../Supplier/Supplier";

export abstract class Product {
  constructor(
    private readonly id: string,
    private readonly name: string,
    private readonly description: string,
    private readonly category: string,
    private basePrice: number,
    private currentStock: number,
    private minimumStockThreshold: number,
    private suppliers: Array<{ supplier: Supplier; price: number }>
  ) {}

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getDescription(): string {
    return this.description;
  }

  getCategory(): string {
    return this.category;
  }

  getBasePrice(): number {
    return this.basePrice;
  }

  getCurrentStock(): number {
    return this.currentStock;
  }

  getMinimumStockThreshold(): number {
    return this.minimumStockThreshold;
  }

  getSuppliers(): Array<{ supplier: Supplier; price: number }> {
    return this.suppliers;
  }

  updateStock(amount: number): void {
    // TODO: When the event bus is in, if the stock goes lower than the minimum threshold, we need to send a reorder event or something similar.
    const newStock = this.currentStock + amount;
    if (newStock < 0) {
      throw new DomainError("Stock cannot be negative");
    }
    this.currentStock = newStock;
  }

  applyDiscount(discountPercentage: number): void {
    if (discountPercentage < 0 || discountPercentage > 100) {
      throw new DomainError("Discount percentage must be between 0 and 100.");
    }
    this.basePrice -= (this.basePrice * discountPercentage) / 100;
  }

  isBelowThreshold(): boolean {
    return this.currentStock < this.minimumStockThreshold;
  }

  getPrice(supplierId?: string): number {
    if (supplierId) {
      const supplier = this.suppliers.find(
        ({ supplier }) => supplier.id === supplierId
      );
      return supplier ? supplier.price : this.basePrice;
    }
    return this.basePrice;
  }

  addSupplier(supplier: Supplier, price: number): void {
    if (this.suppliers.some((s) => s.supplier.id === supplier.id)) {
      throw new DomainError("Supplier already exists for this product");
    }
    this.suppliers.push({ supplier, price });
  }

  removeSupplier(supplierId: string): void {
    const index = this.suppliers.findIndex((s) => s.supplier.id === supplierId);
    if (index !== -1) {
      this.suppliers.splice(index, 1);
    } else {
      throw new DomainError("Supplier not found");
    }
  }

  getCurrentCostBasis(): number {
    const lowestPrice =
      this.suppliers.length > 0
        ? Math.min(...this.suppliers.map((s) => s.price))
        : this.basePrice;
    return lowestPrice * this.currentStock;
  }
}
