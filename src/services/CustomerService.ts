// src/services/CustomerService.ts
import { EventBus } from "../core/EventBus";
import { CustomerRepository } from "../repository/CustomerRepository";
import { OrderRepository } from "../repository/OrderRepository";
import { CustomerOrder } from "../types/";
import { DomainError } from "../utils/Error";
// So, lets just say we did use the ebent bus at this point to publish an event
// this.eventBus.publish("order.placed", order);
// What would be listening for this event?
// 1. InventoryService
// 2. NotificationService
// 3. PaymentService
// 4. ShippingService
// 5. AnalyticsService
// CustomerOrderCreatedEvent

export class CustomerService {
  constructor(
    private customerRepository: CustomerRepository,
    private orderRepository: OrderRepository,
    private eventBus: EventBus
  ) {}

  placeOrder(customerId: string, order: CustomerOrder): void {
    if (!customerId) throw new DomainError("Customer ID is required");
    if (!order || !order.products || order.products.length === 0) {
      throw new DomainError("Order must contain at least one product");
    }
    const customer = this.customerRepository.getById(customerId);
    if (!customer) throw new DomainError("Customer not found");

    this.orderRepository.save(order);
    this.eventBus.publish({
      type: "CustomerOrderCreated",
      payload: {
        products: order.products.map(({ productId, quantity }) => ({
          productId,
          quantity,
        })),
      },
    });
  }
}
