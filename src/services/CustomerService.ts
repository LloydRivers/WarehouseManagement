// src/services/CustomerService.ts
import { EventBus } from "../core/EventBus";
import { CustomerRepository } from "../repository/CustomerRepository";
import { OrderRepository } from "../repository/OrderRepository";
import { CustomerOrder } from "../types/";
import { DomainError } from "../utils/Error";

export class CustomerService {
  /**
   * Constructor using dependency injection pattern.
   */
  constructor(
    private customerRepository: CustomerRepository,
    private orderRepository: OrderRepository,
    private eventBus: EventBus
  ) {}
  // Assignment Brief: Implement a method to place an order for a customer.
  placeOrder(customerId: string, order: CustomerOrder): void {
    this.validateOrder(customerId, order);
    const customer = this.customerRepository.getById(customerId);
    if (!customer) throw new DomainError("Customer not found");

    this.orderRepository.save(order);
    this.publishCustomerOrderCreatedEvent(order);
  }

  /**
   * Publishes a 'CustomerOrderCreated' event to the event bus.
   * Example of the Observer pattern to decouple event handling.
   */
  private publishCustomerOrderCreatedEvent(order: CustomerOrder): void {
    this.eventBus.publish({
      type: "CustomerOrderCreated",
      payload: {
        products: order.products.map(({ productId, quantity, unitPrice }) => ({
          productId,
          quantity,
          unitPrice,
        })),
      },
    });
  }

  /**
   * Validates order input parameters.
   * Example of Separation of Concerns pattern - extracting validation logic.
   */
  private validateOrder(customerId: string, order: CustomerOrder): void {
    if (!customerId) {
      throw new DomainError("Customer ID is required");
    }

    if (!order || !order.products || order.products.length === 0) {
      throw new DomainError("Order must contain at least one product");
    }
  }
}
