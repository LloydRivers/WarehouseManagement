import { IEvent } from "../types/events";
import { ConsoleLogger } from "../utils/Logger";

interface FinancialReport {
    totalSales: number;
    totalPurchases: number;
    netIncome: number;
  }
  

export class FinancialReportService {
    private totalSales = 0;
    private totalPurchases = 0;
  
    constructor(private readonly logger: ConsoleLogger) {}
  
    handleEvent(event: IEvent): void {
      switch (event.type) {
        case "CustomerOrderCreated":
          for (const item of event.payload.products) {
            const revenue = item.quantity * this.getProductPrice(item.productId);
            this.totalSales += revenue;
          }
          break;
  
        case "StockReplenished":
          for (const item of event.payload.products) {
            const cost = item.quantity * item.unitCost;
            this.totalPurchases += cost;
          }
          break;
  
        default:
          break;
      }
    }
  
    getReport(): FinancialReport {
      return {
        totalSales: this.totalSales,
        totalPurchases: this.totalPurchases,
        netIncome: this.totalSales - this.totalPurchases,
      };
    }
  
    private getProductPrice(productId: string): number {
      // Placeholder – ideally query the product entity directly or use a repo
      return 10; // Replace this with actual price lookup logic
    }
  }
  