import { ConsoleLogger } from "../utils/Logger";
import { InventoryRepository } from "../repository/InventoryRepository";
import { DomainError } from "../utils/Error";
import { EventBus } from "../core/EventBus";
import { ISubscriber } from "../types/subscriber";
import { IEvent } from "../types/events";

export class InventoryService implements ISubscriber {
  constructor(
    private logger: ConsoleLogger,
    private inventoryRepository: InventoryRepository, // Injected: InventoryRepo
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
      // We have a few if statements here, and there is the potential for more
      if (!product) {
        throw new DomainError(`Product ${productId} not found`);
      }
      // Could this be grounds for the strategy pattern?
      if (product.getCurrentStock() < quantity) {
        throw new DomainError(
          `Not enough stock for product ${productId}. Available: ${product.getCurrentStock()}, Required: ${quantity}`
        );
      }

      // Here we could check if the order can go through but it takes the stock below the minimum threshold, we need to potential send an event to a supplier service or a stock service

      if (
        product.getCurrentStock() - quantity <
        product.getMinimumStockThreshold()
      ) {
        this.logger.warn(
          `Stock for product ${productId} is below minimum threshold. Current stock: ${product.getCurrentStock()}, Minimum threshold: ${product.getMinimumStockThreshold()}`
        );
        /*
        TODO: This is where we would send an event to a supplier service or a stock service. 
        
        Issue to research: Either make the event bus class generic or the publish method generic.

        Reasons: Typescript is always expecting an event of type IEvent, but we want to send different event types, whilst also not breaking all the types in the test file.
        */
        this.eventBus.publish({
          type: "ReorderStock",
          payload: {
            products: [
              {
                productId,
                quantity:
                  product.getMinimumStockThreshold() -
                  (product.getCurrentStock() - quantity),
              },
            ],
          },
        });
        this.logger.info(
          `Reorder event published for product ${productId}. Quantity to reorder: ${
            product.getMinimumStockThreshold() -
            (product.getCurrentStock() - quantity)
          }`
        );
      }

      product.reduceStock(quantity);
      this.inventoryRepository.update(product);
    });

    this.logger.info(`Handled event: ${event.type}`);
    this.logger.info(`Event payload: ${JSON.stringify(event.payload)}`);
    this.logger.info(`Event handled by: ${this.getName()}`);
    this.logger.info(`Event handled at: ${new Date().toISOString()}`);
    this.logger.info(`Event handled successfully`);
  }
}
