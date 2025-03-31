// src/services/CustomerService.ts
import { EventBus } from "../core/EventBus";
import { Customer } from "../models/Customer/Customer";
import { IOrderHistory } from "../types/";
import { DomainError } from "../utils/Error";

export class CustomerService {
  private customers: Map<string, Customer>;
  private eventBus: EventBus;

  constructor(eventBus: EventBus) {
    this.customers = new Map();
    this.eventBus = eventBus;
  }

  placeOrder(customerId: string, order: IOrderHistory): void {
    const customer = this.customers.get(customerId);
    if (!customer) throw new DomainError("Customer not found");

    customer.placeOrder(order);

    this.eventBus.publish({
      type: "CustomerOrderCreated",
      payload: {
        customerId: customer.id,
        orderId: order.orderId,
        products: order.products,
      },
    });

    // Stuff goes here
  }
}
