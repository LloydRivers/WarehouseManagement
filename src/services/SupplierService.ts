// src/services/SupplierService.ts

import { IEvent } from "../types/events";
import { ConsoleLogger } from "../utils/Logger";

export class SupplierService {
  constructor(private logger: ConsoleLogger) {}

  getName(): string {
    return "SupplierService";
  }

    handleEvent(event: IEvent): boolean {
      if (event.type === "ReorderStock") {
        this.logger.info(
          `SupplierService received ReorderStock event: ${JSON.stringify(event.payload)}`
        );
        return true;
      } else {
        this.logger.warn(`SupplierService ignoring event type: ${event.type}`);
        return false;
      }
    }
  }
