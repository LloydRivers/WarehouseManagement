import { EventBus } from "../../src/core/EventBus";
import { InMemoryCustomerDataSource } from "../../src/loader/InMemoryCustomerDataSource";
import { InMemoryProductDataSource } from "../../src/loader/InMemoryProductDataSource";
import { InMemorySupplierDataSource } from "../../src/loader/InMemorySupplierRepository";
import { CustomerRepository } from "../../src/repository/CustomerRepository";
import { InventoryRepository } from "../../src/repository/InventoryRepository";
import { PurchaseOrderRepository } from "../../src/repository/PurchaseOrderRepository";
import { SupplierRepository } from "../../src/repository/SupplierRepository";
import { OrderRepository } from "../../src/repository/OrderRepository";
import { CustomerService } from "../../src/services/CustomerService";
import { FinancialReportService } from "../../src/services/FinancialReportService";
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
  let financialReportService: FinancialReportService;
  let purchaseOrderRepository: PurchaseOrderRepository;
  let supplierRepository: SupplierRepository;
  let supplierDataSource: InMemorySupplierDataSource;

  beforeEach(() => {
    mockLogger = {
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    } as unknown as ConsoleLogger;

    eventBus = new EventBus(mockLogger);

    customerDataSource = new InMemoryCustomerDataSource();
    customerRepository = new CustomerRepository(customerDataSource);

    supplierDataSource = new InMemorySupplierDataSource();
    supplierRepository = new SupplierRepository(supplierDataSource);

    // 🔁 FIX: define this BEFORE injecting into inventoryRepository
    inventoryDataSource = new InMemoryProductDataSource(supplierRepository);
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

    purchaseOrderRepository = new PurchaseOrderRepository();
    supplierService = new SupplierService(
      mockLogger,
      inventoryRepository,
      eventBus,
      purchaseOrderRepository,
      supplierRepository
    );

    financialReportService = new FinancialReportService(mockLogger);

    eventBus.subscribe(EVENT_TYPES.CUSTOMER_ORDER_CREATED, inventoryService);
    eventBus.subscribe(EVENT_TYPES.REORDER_STOCK, supplierService);
    eventBus.subscribe(
      EVENT_TYPES.CUSTOMER_ORDER_CREATED,
      financialReportService
    );
    eventBus.subscribe(EVENT_TYPES.STOCK_REPLENISHED, financialReportService);
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
    const publishSpy = vi.spyOn(eventBus, "publish");
    const calls = publishSpy.mock.calls;
    customerService.placeOrder(customerId, orderData);
    expect(calls[0][0]).toEqual({
      type: EVENT_TYPES.CUSTOMER_ORDER_CREATED,
      payload: {
        products: [
          {
            productId: "product-001",
            quantity: 45,
            unitPrice: 10,
          },
        ],
      },
    });
    expect(calls[1][0]).toEqual({
      type: EVENT_TYPES.REORDER_STOCK,
      payload: {
        products: [
          {
            productId: "product-001",
            quantity: 45,
            unitPrice: 10,
          },
        ],
      },
    });
    expect(publishSpy).toHaveBeenCalledTimes(3);

    const product = inventoryRepository.getById("product-001");
    expect(product).toBeDefined();
    expect(product!.getCurrentStock()).toBe(50);
  });
  it("calculates total sales correctly from CustomerOrderCreated event", () => {
    //We create the order and publish the event
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
          unitPrice: 30,
        },
      ],
    };

    const publishSpy = vi.spyOn(eventBus, "publish");

    customerService.placeOrder(orderId, orderData);

    const calls = publishSpy.mock.calls;

    expect(calls[0][0]).toEqual({
      type: EVENT_TYPES.CUSTOMER_ORDER_CREATED,
      payload: {
        products: [
          {
            productId: "product-001",
            quantity: 45,
            unitPrice: 30,
          },
        ],
      },
    });

    expect(calls[1][0]).toEqual({
      type: EVENT_TYPES.REORDER_STOCK,
      payload: {
        products: [
          {
            productId: "product-001",
            quantity: 45,
            unitPrice: 30,
          },
        ],
      },
    });

    expect(calls[2][0]).toEqual({
      type: EVENT_TYPES.STOCK_REPLENISHED,
      payload: {
        products: [
          {
            productId: "product-001",
            quantity: 45,
            unitPrice: 10,
          },
        ],
      },
    });

    expect(publishSpy).toHaveBeenCalledTimes(3);

    expect(financialReportService.getReport()).toEqual({
      totalSales: 1350,
      totalPurchases: 450,
      netIncome: 900,
    });
  });
});
