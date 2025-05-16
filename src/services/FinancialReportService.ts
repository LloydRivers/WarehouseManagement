import { InventoryRepository } from "../repository/InventoryRepository";
import {
  IEvent,
  IOrderItem,
  EVENT_TYPES,
} from "../types/events";
import { ConsoleLogger } from "../utils/Logger";

interface FinancialReport {
  totalSales: number;
  totalPurchases: number;
  netIncome: number;
}

// Type guard functions to ensure type safety
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

  constructor(
    private readonly logger: ConsoleLogger,
    private readonly inventoryRepository: InventoryRepository
  ) {}

  getName(): string {
    return "FinancialReportService";
  }

  handleEvent(event: IEvent): void {
    this.logger.info(
      `FinancialReportService: Handling event of type ${event.type}`
    );

    if (isCustomerOrderCreated(event)) {
      for (const item of event.payload.products) {
        console.log("______");
        console.log(item.unitPrice);
        console.log("______");
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

  getReport(): FinancialReport {
    return {
      totalSales: this.totalSales, // This will become 4500
      totalPurchases: this.totalPurchases, // This will become 4500
      netIncome: this.totalSales - this.totalPurchases, // This will become 0
    };
  }

  private getProductPrice(productId: string): number {
    const product = this.inventoryRepository.getById(productId);

    if (!product) {
      this.logger.error(`Product not found: ${productId}`);
      return 0;
    }
    return product.getBasePrice();
  }
}
