// src/eventBus.ts
import { IEvent } from "../types/events";
import { ISubscriber } from "../types/subscriber";
import { ILogger } from "../utils/Logger";

export class EventBus {
  private subscribers: Map<string, ISubscriber[]> = new Map();
  private logger: ILogger;

  constructor(logger: ILogger) {
    this.logger = logger;
  }

  subscribe(eventType: string, subscriber: ISubscriber): void {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, []);
    }
    this.subscribers.get(eventType)!.push(subscriber);
    this.logger.info(
      `[EventBus] ${subscriber.getName()} subscribed to ${eventType}`
    );
  }

  publish(event: IEvent): void {
    this.logger.info(`[EventBus] Publishing event: ${event.type}`);
    this.notifySubscribers(event.type, event);
  }

  private notifySubscribers(eventType: string, event: IEvent) {
    const subscribers = this.subscribers.get(eventType) || [];
    if (subscribers.length === 0) {
      this.logger.info(`[EventBus] No subscribers for ${eventType}`);
      return;
    }

    subscribers.forEach((subscriber) => {
      this.logger.info(
        `[EventBus] Notifying ${subscriber.getName()} about ${eventType}`
      );
      subscriber.handleEvent(event);
    });
  }

  clearSubscriptions(): void {
    this.subscribers = new Map();
  }
}
