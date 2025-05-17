import { InventoryRepository } from "../repository/InventoryRepository";
import { IEvent, IOrderItem, EVENT_TYPES } from "../types/events";
import { ConsoleLogger } from "../utils/Logger";

interface FinancialReport {
  totalSales: number;
  totalPurchases: number;
  netIncome: number;
}

function isCustomerOrderCreated(
  event: IEvent
): event is IEvent & { type: "CustomerOrderCreated" } {
  return event.type === EVENT_TYPES.CUSTOMER_ORDER_CREATED;
}

function isStockReplenished(
  event: IEvent
): event is IEvent & { type: "StockReplenished" } {
  return event.type === EVENT_TYPES.STOCK_REPLENISHED;
}
export class FinancialReportService {
  private totalSales = 0;
  private totalPurchases = 0;

  constructor(private readonly logger: ConsoleLogger) {}

  getName(): string {
    return "FinancialReportService";
  }

  handleEvent(event: IEvent): void {
    this.logger.info(
      `FinancialReportService: Handling event of type ${event.type}`
    );
    // Assignment Brief: Track financial transactions related to inventory purchases and sales
    if (isCustomerOrderCreated(event)) {
      for (const item of event.payload.products) {
        const revenue = item.quantity * item.unitPrice;

        this.totalSales += revenue;
      }
    } else if (isStockReplenished(event)) {
      for (const item of event.payload.products as IOrderItem[]) {
        const cost = item.quantity * item.unitPrice;
        this.totalPurchases += cost;
      }
    }
  }
  // Assignment Brief: Generate basic financial reports such as sales summaries and expense reports.
  getReport(): FinancialReport {
    return {
      totalSales: this.totalSales,
      totalPurchases: this.totalPurchases,
      netIncome: this.totalSales - this.totalPurchases,
    };
  }
}
