import { InMemoryProductDataSource } from "../loader/InMemoryProductDataSource";
import { Product } from "../models/inventory/Product";

export class InventoryRepository {
  private dataSource: InMemoryProductDataSource;
  private products: Product[];

  /**
   * Constructor using dependency injection pattern.
   */
  constructor(dataSource: InMemoryProductDataSource) {
    this.dataSource = dataSource;
    this.products = this.dataSource.loadProducts();
  }

  getById(productId: string): Product | undefined {
    return this.products.find((product) => product.getId() === productId);
  }

  update(product: Product): void {
    const index = this.products.findIndex(
      (existing) => existing.getId() === product.getId()
    );
    if (index === -1) {
      throw new Error("Cannot update non-existent product");
    }
    this.products[index] = product;
  }
  // Assignment Brief: Allow the user to view all stock in the inventory.
  getAllStock() {
    return this.products;
  }
}
