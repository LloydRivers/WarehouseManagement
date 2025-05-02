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
import { InMemoryProductDataSource } from "./loader/InMemoryProductDataSource";
import { InventoryRepository } from "./repository/InventoryRepository";

/*
EventBus
  ↓
CustomerOrderCreated
  ↓
InventoryService (subscribed to event)
  ↓
InventoryRepository (injectable)
  ↓
InMemoryProductDataSource (currently faking DB)

*/

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
  new ConsoleLogger(),
  inventoryRepository,
  eventBus
);
eventBus.subscribe(EVENT_TYPES.CUSTOMER_ORDER_CREATED, inventoryService);
// We place the order
customerService.placeOrder("1", {
  customerId: "1",
  id: "1",
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
});

/*
What I expect to happen:
1. A customer is created.
2. An order is placed for the customer.
3. The order is processed (stock is checked and potentially reordered)
4. The inventory is updated.
5. The customer is notified about the order status.
6. The order is completed.
7. The customer is notified about the order completion.
8. The inventory is updated again.
9. The customer is notified about the inventory update. 
*/
