// src/services/SupplierService.ts

import { InventoryRepository } from "../repository/InventoryRepository";
import { IEvent } from "../types/events";
import { ConsoleLogger } from "../utils/Logger";

export class SupplierService {
  private logger: ConsoleLogger;
  private inventoryRepository: InventoryRepository;

  constructor(logger: ConsoleLogger, inventoryRepository: InventoryRepository) {
    this.logger = logger;
    this.inventoryRepository = inventoryRepository;
  }

  getName(): string {
    return "SupplierService";
  }

  handleEvent(event: IEvent): boolean {
    if (event.type === "ReorderStock") {
      const id = event.payload.products[0].productId;
      this.logger.info(`Reordering stock for product ${id}`);

      const product = this.inventoryRepository.getById(id);
      if (product) {
        // Reorder to the minimum stock level (or you can define another value if needed)
        product.replenishToFullStock(); // Restoring to min threshold
        this.inventoryRepository.update(product);
        return true;
      } else {
        this.logger.error(
          `Product not found for reorder: ${id}. Cannot replenish stock.`
        );
        return false;
      }
    } else {
      this.logger.warn(`Ignoring event type: ${event.type}`);
      return false;
    }
  }
}
