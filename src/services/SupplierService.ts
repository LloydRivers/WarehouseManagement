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

    const reOrderQty = event.payload.products[0].quantity;

    const { productId } = event.payload.products[0];

    const product = this.inventoryRepository.getById(productId);

    const unitCost = event.payload.products[0].unitPrice;

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
            productId: product.getId(), // this is "product-001"
            quantity: reOrderQty, // this is 45
            unitPrice: product.getBasePrice(), // this is 100
          },
        ],
      },
    });

    return true;
  }
}
