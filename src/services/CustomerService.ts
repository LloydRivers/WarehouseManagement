// src/services/CustomerService.ts
import { EventBus } from "../core/EventBus";
import { CustomerRepository } from "../repository/CustomerRepository";
import { OrderRepository } from "../repository/OrderRepository";
import { CustomerOrder } from "../types/";
import { DomainError } from "../utils/Error";

export class CustomerService {
  constructor(
    private customerRepository: CustomerRepository,
    private orderRepository: OrderRepository,
    private eventBus: EventBus
  ) {}

  placeOrder(customerId: string, order: CustomerOrder): void {
    const customer = this.customerRepository.getById(customerId);
    if (!customer) throw new DomainError("Customer not found");

    this.orderRepository.save(order);

    this.eventBus.publish({
      type: "CustomerOrderCreated",
      payload: {
        customerId: order.customerId,
        orderId: order.id,
        products: order.products,
      },
    });
  }
}
