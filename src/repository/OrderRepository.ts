// src/repository/OrderRepository.ts
import { CustomerOrder } from "../types/index";

export class OrderRepository {
  private orders: CustomerOrder[] = [];

  save(order: CustomerOrder): void {
    this.orders.push(order);
  }

  getByCustomerId(customerId: string): CustomerOrder[] {
    return this.orders.filter((order) => order.customerId === customerId);
  }

  update(order: CustomerOrder): void {
    const index = this.orders.findIndex(({ id }) => id === order.id);
    if (index !== -1) {
      this.orders[index] = order;
    }
  }
}
