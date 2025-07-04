import * as readline from "readline";
import { createApp } from "../app";

export class WarehouseCLI {
  private rl: readline.Interface;
  private customerService;
  private financialReportService;
  private inventoryService;
  private supplierService;

  constructor() {
    const app = createApp();
    this.customerService = app.customerService;
    this.financialReportService = app.financialReportService;
    this.inventoryService = app.inventoryService;
    this.supplierService = app.supplierService;

    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  public run(): void {
    this.menu();
  }

  private menu(): void {
    console.log("\nWarehouse Management System");
    console.log("1. Place Order");
    console.log("2. View Financial Report");
    console.log("3. View Inventory Stock Levels");
    console.log("4. View Suppliers");
    console.log("5. Exit");
    this.rl.question("Choose an option: ", (choice) => this.handleMenu(choice));
  }

  private handleMenu(choice: string): void {
    switch (choice) {
      case "1":
        this.placeOrder();
        break;
      case "2":
        this.viewReport();
        break;
      case "3":
        this.viewInventory();
        break;
      case "4":
        this.viewSuppliers();
        break;
      case "5":
        this.rl.close();
        break;
      default:
        console.log("Invalid option.");
        this.menu();
        break;
    }
  }

  placeOrder(): void {
    this.rl.question("Enter Customer ID: ", (customerId) => {
      this.rl.question("Enter Product ID: ", (productId) => {
        this.rl.question("Enter Quantity: ", (quantity) => {
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
          this.customerService.placeOrder("1", orderDetails);
          console.log("Order placed successfully!");
          this.menu();
        });
      });
    });
  }

  viewReport(): void {
    const report = this.financialReportService.getReport();
    console.log("\n=== Financial Report ===");
    console.log(`Total Sales: £${report.totalSales}`);
    console.log(`Total Purchases: £${report.totalPurchases}`);
    console.log(`Net Income: £${report.netIncome}`);
    this.menu();
  }

  viewInventory(): void {
    const stock = this.inventoryService.getAllStock();
    console.log("\n=== Inventory Stock Levels ===");
    for (const item of stock) {
      console.log(
        `${item.getDescription()} - Current Stock: ${item.getCurrentStock()}, Minimum Threshold: ${item.getMinimumStockThreshold()}`
      );
    }
    this.menu();
  }

  viewSuppliers(): void {
    const suppliers = this.supplierService.getAllSuppliers();
    console.log("\n=== Suppliers ===");
    for (const supplier of suppliers) {
      console.log(`${supplier.getName()} - ID: ${supplier.getId()}`);
    }
    this.menu();
  }
}
