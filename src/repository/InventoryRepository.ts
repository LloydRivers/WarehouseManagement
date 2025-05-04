import { InMemoryProductDataSource } from "../loader/InMemoryProductDataSource";
import { Product } from "../models/inventory/Product";

export class InventoryRepository {
  private dataSource: InMemoryProductDataSource;

  constructor(dataSource: InMemoryProductDataSource) {
    this.dataSource = dataSource;
  }

  getById(productId: string): Product | undefined {
    const products = this.dataSource.loadProducts();
    return products.find((product) => product.getId() === productId);
  }

  // Needs the update method to be implemented.
  update(product: Product): void {
    const products = this.dataSource.loadProducts();
    const existingProduct = products.find(
      (existing) => existing.getId() === product.getId()
    );
    if (!existingProduct) {
      throw new Error("Cannot update non-existent product");
    }
    // Update the product in the data source
    const index = products.indexOf(existingProduct);
    products[index] = product;
    // this.dataSource.saveProducts(products);
  }
}
