// repository/PurchaseOrderRepository.ts
import { PurchaseOrder } from "../models/PurchaseOrder/PurchaseOrder";

export class PurchaseOrderRepository {
  private orders: PurchaseOrder[] = [];

  save(order: PurchaseOrder): void {
    this.orders.push(order);
    console.log("_______________________");
    console.log("Purchase Order saved:", order);
    console.log("_______________________");
  }

  getBySupplierId(supplierId: string): PurchaseOrder[] {
    return this.orders.filter((order) => order.getSupplierId() === supplierId);
  }

  update(order: PurchaseOrder): void {
    const index = this.orders.findIndex((o) => o.getId() === order.getId());
    if (index !== -1) {
      this.orders[index] = order;
    }
  }
}
