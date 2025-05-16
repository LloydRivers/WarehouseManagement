// index.ts

import * as readline from "readline";
import { InMemoryCustomerDataSource } from "./loader/InMemoryCustomerDataSource";
import { CustomerRepository } from "./repository/CustomerRepository";
import { ConsoleLogger } from "./utils/Logger";
import { OrderRepository } from "./repository/OrderRepository";
import { EventBus } from "./core/EventBus";
import { CustomerService } from "./services/CustomerService";
import { SupplierService } from "./services/SupplierService";
import { InventoryService } from "./services/InventoryService";
import { EVENT_TYPES } from "./types/events";
import { InMemoryProductDataSource } from "./loader/InMemoryProductDataSource";
import { InventoryRepository } from "./repository/InventoryRepository";
import { FinancialReportService } from "./services/FinancialReportService";

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

const financialReportService = new FinancialReportService(logger);

// Subscribe to events
eventBus.subscribe(EVENT_TYPES.CUSTOMER_ORDER_CREATED, inventoryService);
eventBus.subscribe(EVENT_TYPES.REORDER_STOCK, supplierService);
eventBus.subscribe(EVENT_TYPES.CUSTOMER_ORDER_CREATED, financialReportService);
eventBus.subscribe(EVENT_TYPES.STOCK_REPLENISHED, financialReportService);

// Assignment Brief: Create a way a user can interact with the system
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Menu function
function menu(): void {
  console.log("\nWarehouse Management System");
  console.log("1. Place Order");
  console.log("2. View Financial Report");
  console.log("3. Exit");
  rl.question("Choose an option: ", handleMenu);
}

// Handle menu options
function handleMenu(choice: string): void {
  switch (choice) {
    case "1":
      return placeOrder();
    case "2":
      return viewReport();
    case "3":
      rl.close();
      break;
    default:
      console.log("Invalid option.");
      menu();
  }
}
// Assignment Brief: Process customer orders, and update inventory levels accordingly.
function placeOrder(): void {
  rl.question("Enter Customer ID: ", (customerId) => {
    rl.question("Enter Product ID: ", (productId) => {
      rl.question("Enter Quantity: ", (quantity) => {
        const orderDetails = {
          customerId,
          id: "1",
          orderDate: new Date().toISOString(),
          products: [
            {
              productId,
              quantity: Number(quantity),
              unitPrice: 30,
            },
          ],
        };
        customerService.placeOrder("1", orderDetails);
        console.log("Order placed successfully!");
        menu();
      });
    });
  });
}

function viewReport(): void {
  const report = financialReportService.getReport();
  console.log("\n=== Financial Report ===");
  console.log(`Total Sales: £${report.totalSales}`);
  console.log(`Total Purchases: £${report.totalPurchases}`);
  console.log(`Net Income: £${report.netIncome}`);
  menu();
}

// Start the menu
menu();

/*
This was the original code that has now been replaced with the menu function to meet the assignment brief.
-------------------------------------
customerService.placeOrder("1", {
  customerId: "1",
  id: "1",
  // We pass the date
  orderDate: new Date().toISOString(),
  products: [
    {
      productId: "product-001",
      quantity: 45,
      unitPrice: 30,
    },
  ],
});
*/
