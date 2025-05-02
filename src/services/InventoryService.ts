import { ConsoleLogger, ILogger } from "../utils/Logger";
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
      const { products } = event.payload;
      products.forEach(({ productId, quantity }) => {
        const product = this.inventoryRepository.getById(productId);
        if (!product) {
          this.logger.error(`Product ${productId} not found`);
          return;
        }
        // if (product.stock < quantity) {
        //   this.logger.error(
        //     `Not enough stock for product ${productId}. Available: ${product.stock}, Required: ${quantity}`
        //   );
        //   return;
        // }
        // product.stock -= quantity;
        // this.inventoryRepository.update(product);
      });
    } else {
      this.logger.error(`Event type ${event.type} not handled`);
    }
    this.logger.info(`Handled event: ${event.type}`);
    this.logger.info(`Event payload: ${JSON.stringify(event.payload)}`);
    this.logger.info(`Event handled by: ${this.getName()}`);
    this.logger.info(`Event handled at: ${new Date().toISOString()}`);
    this.logger.info(`Event handled successfully`);
  }
}
