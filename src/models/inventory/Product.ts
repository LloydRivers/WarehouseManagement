// src/models/Product.ts
import { DomainError } from "../../utils/Error";
import { Supplier } from "../Supplier/Supplier";

// Assignment Brief: Abstract Class and Inheritance
export abstract class Product {
  constructor(
    public supplier: Supplier,
    private readonly id: string,
    public supplierId: string,
    private readonly name: string,
    private readonly description: string,
    private readonly category: string,
    private basePrice: number,
    private currentStock: number,
    private maximumStockLevel: number,
    private minimumStockThreshold: number
  ) {}

  getId(): string {
    return this.id;
  }
  getSupplierId(): string {
    return this.supplierId;
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

  getMaximumStockLevel(): number {
    return this.maximumStockLevel;
  }

  getMinimumStockThreshold(): number {
    return this.minimumStockThreshold;
  }

  reduceStock(amount: number): void {
    const newStock = this.currentStock - amount;
    if (newStock < 0) {
      throw new DomainError("Stock cannot be negative");
    }
    this.currentStock = newStock;
  }
  replenishToFullStock(): void {
    this.currentStock = this.maximumStockLevel;
  }

  isBelowThreshold(): boolean {
    return this.currentStock < this.minimumStockThreshold;
  }
  // Assignment Brief: Polymorphism
  abstract calculateDiscountedPrice(discountRate: number): number;
}
