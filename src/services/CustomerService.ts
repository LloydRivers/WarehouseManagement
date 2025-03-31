// src/services/CustomerService.ts
import { EventBus } from "../core/EventBus";
import { CustomerRepository } from "../repository/CustomerRepository";
import { IOrderHistory } from "../types/";
import { DomainError } from "../utils/Error";

export class CustomerService {
  constructor(
    private customerRepository: CustomerRepository,
    private eventBus: EventBus
  ) {}

  placeOrder(customerId: string, order: IOrderHistory): void {
    const customer = this.customerRepository.getById(customerId);
    if (!customer) throw new DomainError("Customer not found");

    customer.placeOrder(order);
    this.customerRepository.update(customer); // Persist the change

    this.eventBus.publish({
      type: "CustomerOrderCreated",
      payload: {
        customerId: customer.id,
        orderId: order.orderId,
        products: order.products,
      },
    });
  }
}
