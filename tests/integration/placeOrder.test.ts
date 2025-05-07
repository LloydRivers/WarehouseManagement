import { EventBus } from "../../src/core/EventBus";
import { InMemoryCustomerDataSource } from "../../src/loader/InMemoryCustomerDataSource";
import { InMemoryProductDataSource } from "../../src/loader/InMemoryProductDataSource";
import { CustomerRepository } from "../../src/repository/CustomerRepository";
import { InventoryRepository } from "../../src/repository/InventoryRepository";
import { OrderRepository } from "../../src/repository/OrderRepository";
import { CustomerService } from "../../src/services/CustomerService";
import { InventoryService } from "../../src/services/InventoryService";
import { SupplierService } from "../../src/services/SupplierService";
import { CustomerOrder } from "../../src/types";
import { EVENT_TYPES } from "../../src/types/events";
import { ConsoleLogger } from "../../src/utils/Logger";

describe("E2E: placeOrder flow", () => {
  let mockLogger: ConsoleLogger;
  let eventBus: EventBus;
  let customerDataSource: InMemoryCustomerDataSource;
  let customerRepository: CustomerRepository;
  let inventoryDataSource: InMemoryProductDataSource;
  let orderRepository: OrderRepository;
  let customerService: CustomerService;
  let inventoryRepository: InventoryRepository;
  let inventoryService: InventoryService;
  let supplierService: SupplierService;

  beforeEach(() => {
    mockLogger = {
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    } as unknown as ConsoleLogger;

    eventBus = new EventBus(mockLogger);

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
      mockLogger,
      inventoryRepository,
      eventBus
    );

    supplierService = new SupplierService(mockLogger);

    eventBus.subscribe(EVENT_TYPES.CUSTOMER_ORDER_CREATED, inventoryService);

    eventBus.subscribe(EVENT_TYPES.REORDER_STOCK, supplierService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
  it("throws an error if no customer id", () => {
    const orderId: string = "1";
    const orderData: CustomerOrder = {
      customerId: "",
      id: orderId,
      orderDate: new Date().toISOString(),
      products: [
        {
          productId: "product-001",
          quantity: 2,
          unitPrice: 10,
        },
      ],
    };

    expect(() => customerService.placeOrder("", orderData)).toThrow(
      "Customer ID is required"
    );
  });
  it("throws an error if no no product", () => {
    const orderId: string = "1";
    const customerId: string = "1";
    const orderData: CustomerOrder = {
      customerId,
      id: orderId,
      orderDate: new Date().toISOString(),
      products: [],
    };

    expect(() => customerService.placeOrder(customerId, orderData)).toThrow(
      "Order must contain at least one product"
    );
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
  it("reorders stock when stock is below minimum threshold", () => {
    const orderId: string = "1";
    const customerId: string = "1";
    const orderData: CustomerOrder = {
      customerId,
      id: orderId,
      orderDate: new Date().toISOString(),
      products: [
        {
          productId: "product-001",
          quantity: 45,
          unitPrice: 10,
        },
      ],
    };

    customerService.placeOrder(orderId, orderData);
    const product = inventoryRepository.getById("product-001");
    expect(product).toBeDefined();
    expect(product!.getCurrentStock()).toBe(5);
    /*
    Looking at the logic, we would expect the logger.warn to be called with the message: Stock for product product-001 is below minimum threshold. Current stock: 5, Minimum threshold: 10 so lets write an expect for that.
    */

    expect(mockLogger.warn).toHaveBeenCalledWith(
      `Stock warning for product product-001:
  - Initial stock: 50
  - Quantity ordered: 45
  - Final stock: 5
  - Minimum threshold: 10`
    );
  });
});
