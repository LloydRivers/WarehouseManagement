// src/eventBus.ts
import { IEvent } from "../types/events";
import { ISubscriber } from "../types/subscriber";
import { ILogger } from "../utils/Logger";

/**
 * EventBus implements the observer pattern for event-driven communication.
 * It allows subscribers to register for specific event types and receive notifications
 * when those events are published.
 */
export class EventBus {
  private subscribers: Map<string, Set<ISubscriber>> = new Map();
  private readonly logger: ILogger;

  /**
   * Creates a new EventBus instance.
   * @param logger - The logger to use for recording operations
   */
  constructor(logger: ILogger) {
    this.logger = logger;
  }

  /**
   * Gets all subscribers for a specific event type.
   * @param eventType - The event type to get subscribers for
   * @returns An array of subscribers for the specified event type
   */
  getSubscribers(eventType: string): ISubscriber[] {
    const subscribers = this.subscribers.get(eventType);
    if (!subscribers) {
      this.logger.warn(
        `[EventBus] No subscribers found for event type: ${eventType}`
      );
      return [];
    }
    return Array.from(subscribers);
  }

  /**
   * Subscribes a subscriber to a specific event type.
   * @param eventType - The event type to subscribe to
   * @param subscriber - The subscriber to register
   */
  subscribe(eventType: string, subscriber: ISubscriber): void {
    if (!eventType || !subscriber) {
      this.logger.error("[EventBus] Cannot subscribe with null/undefined eventType or subscriber");
      throw new Error("EventType and subscriber must be provided");
    }

    const subscribersForType = this.getOrCreateSubscribers(eventType);

    if (subscribersForType.has(subscriber)) {
      this.logger.warn(
        `[EventBus] ${subscriber.getName()} is already subscribed to ${eventType}`
      );
      return;
    }

    subscribersForType.add(subscriber);
    this.logger.info(
      `[EventBus] ${subscriber.getName()} subscribed to ${eventType}`
    );
  }

  /**
   * Gets or creates a set of subscribers for the given event type.
   * @param eventType - The event type to get or create subscribers for
   * @returns A set of subscribers for the specified event type
   */
  private getOrCreateSubscribers(eventType: string): Set<ISubscriber> {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, new Set());
    }
    return this.subscribers.get(eventType)!;
  }

  /**
   * Unsubscribes a subscriber from a specific event type.
   * @param eventType - The event type to unsubscribe from
   * @param subscriber - The subscriber to unregister
   * @returns true if unsubscription was successful, false otherwise
   */
  unsubscribe(eventType: string, subscriber: ISubscriber): boolean {
    if (!eventType || !subscriber) {
      this.logger.error("[EventBus] Cannot unsubscribe with null/undefined eventType or subscriber");
      return false;
    }

    this.logger.info(
      `[EventBus] Attempting to unsubscribe ${subscriber.getName()} from ${eventType}`
    );

    const subscribers = this.subscribers.get(eventType);
    if (!subscribers || subscribers.size === 0) {
      this.logger.warn(
        `[EventBus] Cannot unsubscribe ${subscriber.getName()} from ${eventType}: no subscribers exist`
      );
      return false;
    }

    const wasRemoved = subscribers.delete(subscriber);

    if (!wasRemoved) {
      this.logger.warn(
        `[EventBus] Cannot unsubscribe ${subscriber.getName()} from ${eventType}: not subscribed`
      );
      return false;
    }

    this.logger.info(
      `[EventBus] ${subscriber.getName()} unsubscribed from ${eventType}`
    );

    if (subscribers.size === 0) {
      this.logger.info(
        `[EventBus] Removed empty subscriber list for ${eventType}`
      );
      this.subscribers.delete(eventType);
    }

    return true;
  }

  /**
   * Unsubscribes a subscriber from all event types.
   * @param subscriber - The subscriber to unregister from all events
   * @returns The number of event types the subscriber was unsubscribed from
   */
  unsubscribeFromAll(subscriber: ISubscriber): number {
    if (!subscriber) {
      this.logger.error("[EventBus] Cannot unsubscribe a null/undefined subscriber from all events");
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
          `[EventBus] ${subscriber.getName()} unsubscribed from ${eventType}`
        );

        if (subscribers.size === 0) {
          this.subscribers.delete(eventType);
          this.logger.info(
            `[EventBus] Removed empty subscriber list for ${eventType}`
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
   * Publishes an event to all subscribers of its type.
   * @param event - The event to publish
   */
  publish(event: IEvent): void {
    if (!event || !event.type) {
      this.logger.error("[EventBus] Cannot publish null/undefined event or event without type");
      throw new Error("Valid event with type must be provided");
    }

    this.logger.info(`[EventBus] Publishing event: ${event.type}`);
    this.notifySubscribers(event.type, event);
  }

  /**
   * Notifies all subscribers for a specific event type.
   * @param eventType - The event type to notify subscribers for
   * @param event - The event to notify subscribers about
   */
  private notifySubscribers(eventType: string, event: IEvent): void {
    const subscribers = this.subscribers.get(eventType);

    if (!subscribers || subscribers.size === 0) {
      this.logger.info(`[EventBus] No subscribers for ${eventType}`);
      return;
    }

    // Create a copy to prevent issues if subscribers are modified during notification
    const subscribersCopy = Array.from(subscribers);
    for (const subscriber of subscribersCopy) {
      this.notifySubscriber(subscriber, eventType, event);
    }
  }

  /**
   * Notifies a specific subscriber about an event.
   * @param subscriber - The subscriber to notify
   * @param eventType - The type of the event
   * @param event - The event to notify about
   */
  private notifySubscriber(
    subscriber: ISubscriber,
    eventType: string,
    event: IEvent
  ): void {
    this.logger.info(
      `[EventBus] Notifying ${subscriber.getName()} about ${eventType}`
    );

    try {
      subscriber.handleEvent(event);
    } catch (error) {
      this.logger.error(
        `[EventBus] Error notifying ${subscriber.getName()} about ${eventType}: ${(error as Error).message}`
      );
      // Re-throw the error or handle it according to your application's error handling strategy
      throw error;
    }
  }

  /**
   * Clears all subscriptions.
   */
  clearSubscriptions(): void {
    this.subscribers.clear();
    this.logger.info(`[EventBus] Cleared all subscriptions`);
  }

  /**
   * Returns the total number of subscribers across all event types.
   * @returns The total number of subscribers
   */
  getTotalSubscribersCount(): number {
    let count = 0;
    for (const subscribers of this.subscribers.values()) {
      count += subscribers.size;
    }
    return count;
  }

  /**
   * Returns the number of event types that have subscribers.
   * @returns The number of event types
   */
  getEventTypesCount(): number {
    return this.subscribers.size;
  }
}