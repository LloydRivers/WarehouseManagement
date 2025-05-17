import * as readline from "readline";
import { createApp } from "./app";

const { customerService, financialReportService } = createApp();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function menu(): void {
  console.log("\nWarehouse Management System");
  console.log("1. Place Order");
  console.log("2. View Financial Report");
  console.log("3. Exit");
  rl.question("Choose an option: ", handleMenu);
}

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

menu();
