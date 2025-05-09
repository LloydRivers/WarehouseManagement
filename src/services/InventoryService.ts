import { ConsoleLogger } from "../utils/Logger";
import { InventoryRepository } from "../repository/InventoryRepository";
import { DomainError } from "../utils/Error";
import { EventBus } from "../core/EventBus";
import { ISubscriber } from "../types/subscriber";
import { IEvent } from "../types/events";

export class InventoryService implements ISubscriber {
  constructor(
    private logger: ConsoleLogger,
    private inventoryRepository: InventoryRepository,
    private eventBus: EventBus // Injected: EventBus
  ) {}

  getName(): string {
    return "InventoryService";
  }

  handleEvent(event: IEvent): void {
    if (event.type === "CustomerOrderCreated") {
      this.processOrderCreatedEvent(event);
    } else {
      this.logger.error(`Event type ${event.type} not handled`);
    }
  }

  private processOrderCreatedEvent(event: IEvent): void {
    const { products } = event.payload;

    products.forEach(({ productId, quantity }) => {
      const product = this.inventoryRepository.getById(productId);

      if (!product) {
        throw new DomainError(`Product ${productId} not found`);
      }
      if (product.getCurrentStock() < quantity) {
        throw new DomainError(
          `Not enough stock for product ${productId}. Available: ${product.getCurrentStock()}, Required: ${quantity}`
        );
      }

      product.reduceStock(quantity);
      this.inventoryRepository.update(product);

      if (product.getCurrentStock() < product.getMinimumStockThreshold()) {
        const reorderQty =
          product.getMaximumStockLevel() - product.getCurrentStock();

        this.logger.warn(
          `Stock warning for product ${productId}:\n` +
            `  - Final stock: ${product.getCurrentStock()}\n` +
            `  - Minimum threshold: ${product.getMinimumStockThreshold()}`
        );

        this.eventBus.publish({
          type: "ReorderStock",
          payload: {
            products: [
              {
                productId,
                quantity: reorderQty,
              },
            ],
          },
        });

        this.logger.info(
          `Reorder event published for product ${productId}. Quantity to reorder: ${reorderQty}`
        );
      }
    });

    this.logger.info(`Handled event: ${event.type}`);
    this.logger.info(`Event payload: ${JSON.stringify(event.payload)}`);
    this.logger.info(`Event handled by: ${this.getName()}`);
    this.logger.info(`Event handled at: ${new Date().toISOString()}`);
    this.logger.info(`Event handled successfully`);
  }
}
