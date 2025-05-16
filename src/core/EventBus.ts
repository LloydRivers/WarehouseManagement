// src/eventBus.ts
import { EventMap, IEvent } from "../types/events";
import { ISubscriber } from "../types/subscriber";
import { ILogger } from "../utils/Logger";

/**
 * EventBus implements the observer pattern for event-driven communication.
 * It allows subscribers to register for specific event types and receive notifications
 * when those events are published.
 */
export class EventBus {
  // Assignment Brief: Map from event type keys to subscriber sets: supports polymorphic event handling
  private subscribers: Map<keyof EventMap, Set<ISubscriber>> = new Map();
  private readonly logger: ILogger;
  /**
   * Constructor using dependency injection pattern.
   */
  constructor(logger: ILogger) {
    this.logger = logger;
  }

  getSubscribers<K extends keyof EventMap>(eventType: K): ISubscriber<K>[] {
    const subscribers = this.subscribers.get(eventType);
    if (!subscribers) {
      this.logger.warn(
        `[EventBus] No subscribers found for event type: ${String(eventType)}`
      );
      return [];
    }

    return Array.from(subscribers) as ISubscriber<K>[];
  }

  subscribe<K extends keyof EventMap>(
    eventType: K,
    subscriber: ISubscriber<K>
  ): void {
    if (!eventType || !subscriber) {
      this.logger.error(
        "[EventBus] Cannot subscribe with null/undefined eventType or subscriber"
      );
      throw new Error("EventType and subscriber must be provided");
    }

    const subscribersForType = this.getOrCreateSubscribers(eventType);

    if (subscribersForType.has(subscriber)) {
      this.logger.warn(
        `[EventBus] ${subscriber.getName()} is already subscribed to ${String(eventType)}`
      );
      return;
    }

    subscribersForType.add(subscriber);
    this.logger.info(
      `[EventBus] ${subscriber.getName()} subscribed to ${String(eventType)}`
    );
  }
  private getOrCreateSubscribers<K extends keyof EventMap>(
    eventType: K
  ): Set<ISubscriber> {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, new Set());
    }
    return this.subscribers.get(eventType)!;
  }

  unsubscribe<K extends keyof EventMap>(
    eventType: K,
    subscriber: ISubscriber<K>
  ): boolean {
    if (!eventType || !subscriber) {
      this.logger.error(
        "[EventBus] Cannot unsubscribe with null/undefined eventType or subscriber"
      );
      return false;
    }

    this.logger.info(
      `[EventBus] Attempting to unsubscribe ${subscriber.getName()} from ${String(eventType)}`
    );

    const subscribers = this.subscribers.get(eventType);
    if (!subscribers || subscribers.size === 0) {
      this.logger.warn(
        `[EventBus] Cannot unsubscribe ${subscriber.getName()} from ${String(eventType)}: no subscribers exist`
      );
      return false;
    }

    const wasRemoved = subscribers.delete(subscriber);

    if (!wasRemoved) {
      this.logger.warn(
        `[EventBus] Cannot unsubscribe ${subscriber.getName()} from ${String(eventType)}: not subscribed`
      );
      return false;
    }

    this.logger.info(
      `[EventBus] ${subscriber.getName()} unsubscribed from ${String(eventType)}`
    );

    if (subscribers.size === 0) {
      this.logger.info(
        `[EventBus] Removed empty subscriber list for ${String(eventType)}`
      );
      this.subscribers.delete(eventType);
    }

    return true;
  }

  unsubscribeFromAll(subscriber: ISubscriber): number {
    if (!subscriber) {
      this.logger.error(
        "[EventBus] Cannot unsubscribe a null/undefined subscriber from all events"
      );
      return 0;
    }

    this.logger.info(
      `[EventBus] Unsubscribing ${subscriber.getName()} from all events`
    );

    let unsubscribedCount = 0;

    for (const [eventType, subscribers] of this.subscribers.entries()) {
      if (subscribers.delete(subscriber)) {
        unsubscribedCount++;

        this.logger.info(
          `[EventBus] ${subscriber.getName()} unsubscribed from ${String(eventType)}`
        );

        if (subscribers.size === 0) {
          this.subscribers.delete(eventType);
          this.logger.info(
            `[EventBus] Removed empty subscriber list for ${String(eventType)}`
          );
        }
      }
    }

    this.logger.info(
      `[EventBus] ${subscriber.getName()} unsubscribed from ${unsubscribedCount} event types`
    );

    return unsubscribedCount;
  }
  /**
   * Publishes an event to all subscribers of the event's type.
   * Event dispatch is synchronous with error handling per subscriber.
   */
  publish<K extends keyof EventMap>(event: IEvent<K>): void {
    if (!event || !event.type) {
      this.logger.error(
        "[EventBus] Cannot publish null/undefined event or event without type"
      );
      throw new Error("Valid event with type must be provided");
    }

    this.logger.info(`[EventBus] Publishing event: ${String(event.type)}`);
    this.notifySubscribers(event.type, event);
  }
  private notifySubscribers<K extends keyof EventMap>(
    eventType: K,
    event: IEvent<K>
  ): void {
    const subscribers = this.subscribers.get(eventType);

    if (!subscribers || subscribers.size === 0) {
      this.logger.info(`[EventBus] No subscribers for ${String(eventType)}`);
      return;
    }

    // Create a copy to prevent issues if subscribers are modified during notification
    const subscribersCopy = Array.from(subscribers) as ISubscriber<K>[];
    for (const subscriber of subscribersCopy) {
      this.notifySubscriber(subscriber, eventType, event);
    }
  }

  private notifySubscriber<K extends keyof EventMap>(
    subscriber: ISubscriber<K>,
    eventType: K,
    event: IEvent<K>
  ): void {
    this.logger.info(
      `[EventBus] Notifying ${subscriber.getName()} about ${String(eventType)}`
    );

    try {
      subscriber.handleEvent(event);
    } catch (error) {
      this.logger.error(
        `[EventBus] Error notifying ${subscriber.getName()} about ${String(eventType)}: ${(error as Error).message}`
      );
      // Re-throw the error or handle it according to your application's error handling strategy
      throw error;
    }
  }

  clearSubscriptions(): void {
    this.subscribers.clear();
    this.logger.info(`[EventBus] Cleared all subscriptions`);
  }

  getTotalSubscribersCount(): number {
    let count = 0;
    for (const subscribers of this.subscribers.values()) {
      count += subscribers.size;
    }
    return count;
  }

  getEventTypesCount(): number {
    return this.subscribers.size;
  }
}
