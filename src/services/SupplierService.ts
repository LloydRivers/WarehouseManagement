// src/services/SupplierService.ts

import { InventoryRepository } from "../repository/InventoryRepository";
import { IEvent } from "../types/events";
import { ConsoleLogger } from "../utils/Logger";

export class SupplierService {
  private logger: ConsoleLogger;
  private inventoryRepository: InventoryRepository;

  /**
   * Constructor using dependency injection pattern.
   */
  constructor(logger: ConsoleLogger, inventoryRepository: InventoryRepository) {
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
    return true;
  }
}
