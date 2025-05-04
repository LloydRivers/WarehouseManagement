import { EventBus } from "../../src/core/EventBus";
import { InMemoryCustomerDataSource } from "../../src/loader/InMemoryCustomerDataSource";
import { InMemoryProductDataSource } from "../../src/loader/InMemoryProductDataSource";
import { CustomerRepository } from "../../src/repository/CustomerRepository";
import { InventoryRepository } from "../../src/repository/InventoryRepository";
import { OrderRepository } from "../../src/repository/OrderRepository";
import { CustomerService } from "../../src/services/CustomerService";
import { InventoryService } from "../../src/services/InventoryService";
import { CustomerOrder } from "../../src/types";
import { EVENT_TYPES } from "../../src/types/events";
import { ConsoleLogger } from "../../src/utils/Logger";

describe("E2E: placeOrder flow", () => {
  let logger: ConsoleLogger;
  let eventBus: EventBus;
  let customerDataSource: InMemoryCustomerDataSource;
  let customerRepository: CustomerRepository;
  let inventoryDataSource: InMemoryProductDataSource;
  let orderRepository: OrderRepository;
  let customerService: CustomerService;
  let inventoryRepository: InventoryRepository;
  let inventoryService: InventoryService;

  beforeEach(() => {
    logger = new ConsoleLogger();
    eventBus = new EventBus(logger);

    customerDataSource = new InMemoryCustomerDataSource();
    customerRepository = new CustomerRepository(customerDataSource);

    inventoryDataSource = new InMemoryProductDataSource();
    inventoryRepository = new InventoryRepository(inventoryDataSource);

    orderRepository = new OrderRepository();

    customerService = new CustomerService(
      customerRepository,
      orderRepository,
      eventBus
    );

    inventoryService = new InventoryService(
      logger,
      inventoryRepository,
      eventBus
    );

    eventBus.subscribe(EVENT_TYPES.CUSTOMER_ORDER_CREATED, inventoryService);
  });
  it("persists the order", () => {
    const orderId: string = "1";
    const customerId: string = "1";
    const orderData: CustomerOrder = {
      customerId,
      id: orderId,
      orderDate: new Date().toISOString(),
      products: [
        {
          productId: "product-001",
          quantity: 2,
          unitPrice: 10,
        },
        {
          productId: "product-001",
          quantity: 1,
          unitPrice: 20,
        },
      ],
    };

    customerService.placeOrder(orderId, orderData);

    const customer = customerRepository.getById(customerId);
    expect(customer).toBeDefined();

    const customerOrders = orderRepository.getByCustomerId(customerId);
    expect(customerOrders).toBeDefined();
    expect(customerOrders.length).toBe(1);
    expect(customerOrders[0].id).toBe(orderId);
    expect(customerOrders[0].products.length).toBe(2);
    expect(customerOrders[0].products[0].productId).toBe("product-001");
    expect(customerOrders[0].products[0].quantity).toBe(2);
    expect(customerOrders[0].products[1].productId).toBe("product-001");
    expect(customerOrders[0].products[1].quantity).toBe(1);
    expect(customerOrders[0].orderDate).toBe(orderData.orderDate);
    expect(customerOrders[0].customerId).toBe(customerId);
  });
  it("throws an error if the product is not found", () => {
    const orderId: string = "1";
    const customerId: string = "1";
    const orderData: CustomerOrder = {
      customerId,
      id: orderId,
      orderDate: new Date().toISOString(),
      products: [
        {
          productId: "product-999",
          quantity: 2,
          unitPrice: 10,
        },
      ],
    };

    expect(() => customerService.placeOrder(orderId, orderData)).toThrow(
      "Product product-999 not found"
    );
  });
  it("throws an error if there is not enough stock", () => {
    const orderId: string = "1";
    const customerId: string = "1";
    const orderData: CustomerOrder = {
      customerId,
      id: orderId,
      orderDate: new Date().toISOString(),
      products: [
        {
          productId: "product-001",
          quantity: 1000,
          unitPrice: 10,
        },
      ],
    };

    expect(() => customerService.placeOrder(orderId, orderData)).toThrow(
      "Not enough stock for product product-001. Available: 50, Required: 1000"
    );
  });
  it("reduces the stock", () => {
    const orderId: string = "1";
    const customerId: string = "1";
    const orderData: CustomerOrder = {
      customerId,
      id: orderId,
      orderDate: new Date().toISOString(),
      products: [
        {
          productId: "product-001",
          quantity: 2,
          unitPrice: 10,
        },
        {
          productId: "product-001",
          quantity: 1,
          unitPrice: 20,
        },
      ],
    };

    customerService.placeOrder(orderId, orderData);

    const product = inventoryRepository.getById("product-001");
    expect(product).toBeDefined();
    expect(product!.getCurrentStock()).toBe(47);
  });
});
