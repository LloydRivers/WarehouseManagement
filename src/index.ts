// index.ts
import { ConcreteMix } from "./models/inventory/ConcreteMix";
import { Supplier } from "./models/Supplier/Supplier";
import { Customer } from "./models/Customer/Customer";
import { InMemoryCustomerDataSource } from "./loader/InMemoryCustomerDataSource";
import { CustomerRepository } from "./repository/CustomerRepository";
import { ConsoleLogger } from "./utils/Logger";
import { EventBus } from "./core/EventBus";
import { CustomerService } from "./services/CustomerService";
import { OrderRepository } from "./repository/OrderRepository";
import { InventoryService } from "./services/InventoryService";
import { EVENT_TYPES } from "./types/events";

// Logic to set up the customer.
const customerDataSource = new InMemoryCustomerDataSource();
const customerRepository = new CustomerRepository(customerDataSource);
const customerService = new CustomerService(
  customerRepository,
  new OrderRepository(),
  new EventBus(new ConsoleLogger())
);
// console.log(customerService.placeOrder("1"));

// ---------
const inventoryService = new InventoryService(new ConsoleLogger());
const logger = new ConsoleLogger();
const eventBus = new EventBus(logger);
eventBus.subscribe(EVENT_TYPES.CUSTOMER_ORDER_CREATED, inventoryService);
