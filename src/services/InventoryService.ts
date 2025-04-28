// Let's create an InventoryService
// src/services/InventoryService.ts
import { ConsoleLogger, ILogger } from "../utils/Logger";
import { InventoryRepository } from "../repository/ProductRepository";
import { DomainError } from "../utils/Error";
import { EventBus } from "../core/EventBus";
import { ISubscriber } from "../types/subscriber";
import { IEvent } from "../types/events";

export class InventoryService implements ISubscriber {
  constructor(private logger: ConsoleLogger) {}

  getName(): string {
    return "InventoryService";
  }

  handleEvent(event: IEvent): void {
    this.logger.info(`[InventoryService] Received event: ${event.type}`);
  }
}
