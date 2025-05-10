// src/services/SupplierService.ts

import { InventoryRepository } from "../repository/InventoryRepository";
import { IEvent } from "../types/events";
import { ConsoleLogger } from "../utils/Logger";
import { EventBus } from "../core/EventBus";

export class SupplierService {
  /**
   * Constructor using dependency injection pattern.
   */
  constructor(
    private logger: ConsoleLogger,
    private inventoryRepository: InventoryRepository,
    private eventBus: EventBus
  ) {
    this.eventBus = eventBus;
    this.logger = logger;
    this.inventoryRepository = inventoryRepository;
  }

  getName(): string {
    return "SupplierService";
  }

  handleEvent(event: IEvent): boolean {
    if (event.type !== "ReorderStock") {
      this.logger.warn(`Ignoring event type: ${event.type}`);
      return false;
    }

    const { productId } = event.payload.products[0];
    this.logger.info(`Reordering stock for product ${productId}`);

    const product = this.inventoryRepository.getById(productId);

    if (!product) {
      this.logger.error(
        `Product not found for reorder: ${productId}. Cannot replenish stock.`
      );
      return false;
    }
    // Assignment Brief: Receive new inventory and update stock quantities.
    product.replenishToFullStock();
    this.inventoryRepository.update(product);
    this.eventBus.publish({
      type: "StockReplenished",
      payload: {
        products: [
          {
            productId: product.getId(),
            quantity:
              product.getMaximumStockLevel() - product.getCurrentStock(),
            unitCost: product.getBasePrice(),
          },
        ],
      },
    });

    return true;
  }
}
