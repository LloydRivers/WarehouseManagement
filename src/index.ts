// index.ts
import { ConcreteMix } from "./models/inventory/ConcreteMix";
import { Customer } from "./models/Customer/Customer";
import { InMemoryCustomerDataSource } from "./loader/InMemoryCustomerDataSource";
import { CustomerRepository } from "./repository/CustomerRepository";
import { ConsoleLogger } from "./utils/Logger";
import { EventBus } from "./core/EventBus";
import { CustomerService } from "./services/CustomerService";
import { OrderRepository } from "./repository/OrderRepository";
import { InventoryService } from "./services/InventoryService";
import { EVENT_TYPES } from "./types/events";
import { InMemoryProductDataSource } from "./loader/InMemoryProductDataSource";
import { InventoryRepository } from "./repository/InventoryRepository";
import { SupplierService } from "./services/SupplierService";

const logger = new ConsoleLogger();
const eventBus = new EventBus(logger);

const customerDataSource = new InMemoryCustomerDataSource();
const customerRepository = new CustomerRepository(customerDataSource);

const inventoryDataSource = new InMemoryProductDataSource();

const orderRepository = new OrderRepository();
const customerService = new CustomerService(
  customerRepository,
  orderRepository,
  eventBus
);
const inventoryRepository = new InventoryRepository(inventoryDataSource);
const inventoryService = new InventoryService(
  logger,
  inventoryRepository,
  eventBus
);

const supplierService = new SupplierService(
  logger,
  inventoryRepository,
  eventBus
);
// Subscribe to events
eventBus.subscribe(EVENT_TYPES.CUSTOMER_ORDER_CREATED, inventoryService);
eventBus.subscribe(EVENT_TYPES.REORDER_STOCK, supplierService);
eventBus.subscribe(EVENT_TYPES.STOCK_REPLENISHED, inventoryService);

// Assignment Brief: Process customer orders, and update inventory levels accordingly.
customerService.placeOrder("1", {
  customerId: "1",
  id: "1",
  orderDate: new Date().toISOString(),
  products: [
    {
      productId: "product-001",
      quantity: 45,
      unitPrice: 10,
    },
  ],
});
