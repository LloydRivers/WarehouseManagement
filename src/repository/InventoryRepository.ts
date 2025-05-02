import { InMemoryProductDataSource } from "../loader/InMemoryProductDataSource";
import { Product } from "../models/inventory/Product";

export class InventoryRepository {
  private dataSource: InMemoryProductDataSource;

  constructor(dataSource: InMemoryProductDataSource) {
    this.dataSource = dataSource;
  }

  // Fetches product by ID
  getById(productId: string): Product | undefined {
    const products = this.dataSource.loadProducts();
    console.log(products);
    return products.find((product) => product.getId() === productId);
  }
}
