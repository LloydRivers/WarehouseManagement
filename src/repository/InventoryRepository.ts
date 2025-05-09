import { InMemoryProductDataSource } from "../loader/InMemoryProductDataSource";
import { Product } from "../models/inventory/Product";

export class InventoryRepository {
  private dataSource: InMemoryProductDataSource;
  /**
   * Constructor using dependency injection pattern.
   */
  constructor(dataSource: InMemoryProductDataSource) {
    this.dataSource = dataSource;
  }

  private loadProducts(): Product[] {
    return this.dataSource.loadProducts();
  }

  getById(productId: string): Product | undefined {
    const products = this.loadProducts();
    return products.find((product) => product.getId() === productId);
  }

  update(product: Product): void {
    const products = this.loadProducts();
    const existingProduct = products.find(
      (existing) => existing.getId() === product.getId()
    );
    if (!existingProduct) {
      throw new Error("Cannot update non-existent product");
    }
    const index = products.indexOf(existingProduct);
    products[index] = product;
    // this.dataSource.saveProducts(products);
  }
}
