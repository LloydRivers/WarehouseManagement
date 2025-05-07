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

/*
EventBus subscibes to events.
eventBus.subscribe(EVENT_TYPES.CUSTOMER_ORDER_CREATED, inventoryService);
  ↓
CustomerOrderCreated
customerService.placeOrder("1", {});
  ↓
  Saves the order to the order repository
  this.orderRepository.save(order);
  Then it publishes the event to the event bus
   this.eventBus.publish({type: "CustomerOrderCreated"}
  ↓
InventoryService (subscribed to event)
handleEvent(event: IEvent): void {
    if (event.type === "CustomerOrderCreated") {
      this.processOrderCreatedEvent(event);
    } else {
      this.logger.error(`Event type ${event.type} not handled`);
    }
  }
    It does checks if the product is in stock and if the order can go through
    If the order can go through but it takes the stock below the minimum threshold, we need to reorder stock.

    calls tp upsate the inventory
     product.reduceStock(quantity);
    this.inventoryRepository.update(product);
  ↓
InventoryRepository (injectable)
Incentry is updated
update(product: Product): void {
    const products = this.dataSource.loadProducts();
    const existingProduct = products.find(
      (existing) => existing.getId() === product.getId()
    );
    if (!existingProduct) {
      throw new Error("Cannot update non-existent product");
    }
    // Update the product in the data source
    const index = products.indexOf(existingProduct);
    products[index] = product;
    // this.dataSource.saveProducts(products);
  }
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
  logger,
  inventoryRepository,
  eventBus
);

const supplierService = new SupplierService(logger);
eventBus.subscribe(EVENT_TYPES.CUSTOMER_ORDER_CREATED, inventoryService);
eventBus.subscribe(EVENT_TYPES.REORDER_STOCK, supplierService);
// We place the order and purposefully go lower tgan the min threshold (which is 10). The order can obvouslt proceed because we have 50 in stock, but sicne we have go lower than the min threshold, we need to reorder stock
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
    // {
    //   productId: "product-001",
    //   quantity: 15,
    //   unitPrice: 20,
    // },
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
