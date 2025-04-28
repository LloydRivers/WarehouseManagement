import { Product } from "../models/inventory/Product";

export class InventoryRepository {
  private products: Product[] = []; // Products should be pre-defined with initial quantities

//   getStock(productId: string): number {
//     const product = this.products.find((p) => p.id === productId);
//     return product ? product.quantity : 0;
//   }

//   reduceStock(productId: string, quantity: number): void {
//     const product = this.products.find((p) => p.id === productId);
//     if (product) {
//       product.quantity -= quantity;
//     }
  }
}
