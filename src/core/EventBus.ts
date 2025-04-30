// src/eventBus.ts
import { IEvent } from "../types/events";
import { ISubscriber } from "../types/subscriber";
import { ILogger } from "../utils/Logger";

/**
 * EventBus implements a basic observer pattern.
 * Subscribers listen for events and are notified when events occur.
 */
export class EventBus {
  private subscribers: Map<string, ISubscriber[]> = new Map();
  private logger: ILogger;

  constructor(logger: ILogger) {
    this.logger = logger;
  }

  getSubscribers(eventType: string): ISubscriber[] {
    const subscribers = this.subscribers.get(eventType);
    if (!subscribers) {
      this.logger.warn(
        `[EventBus] No subscribers found for event type: ${eventType}`
      );
      return [];
    }
    return subscribers;
  }

  subscribe(eventType: string, subscriber: ISubscriber): void {
    const subscribersForType = this.getOrCreateSubscribers(eventType);

    if (this.isDuplicateSubscription(subscribersForType, subscriber)) {
      this.logger.warn(
        `[EventBus] ${subscriber.getName()} is already subscribed to ${eventType}`
      );
      return;
    }

    subscribersForType.push(subscriber);
    this.logger.info(
      `[EventBus] ${subscriber.getName()} subscribed to ${eventType}`
    );
  }

  private getOrCreateSubscribers(eventType: string): ISubscriber[] {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, []);
    }
    return this.subscribers.get(eventType)!;
  }

  unsubscribe(eventType: string, subscriber: ISubscriber): boolean {
    this.logger.info(
      `[EventBus] Attempting to unsubscribe ${subscriber.getName()} from ${eventType}`
    );

    const subscribers = this.subscribers.get(eventType);
    if (!subscribers || subscribers.length === 0) {
      this.logger.warn(
        `[EventBus] Cannot unsubscribe ${subscriber.getName()} from ${eventType}: no subscribers exist`
      );
      return false;
    }

    const index = subscribers.indexOf(subscriber);

    if (index === -1) {
      this.logger.warn(
        `[EventBus] Cannot unsubscribe ${subscriber.getName()} from ${eventType}: not subscribed`
      );
      return false;
    }

    subscribers.splice(index, 1);

    this.logger.info(
      `[EventBus] ${subscriber.getName()} unsubscribed from ${eventType}`
    );

    if (subscribers.length === 0) {
      this.logger.info(
        `[EventBus] Removed empty subscriber list for ${eventType}`
      );
      this.subscribers.delete(eventType);
    }

    return true;
  }

  unsubscribeFromAll(subscriber: ISubscriber): number {
    this.logger.info(
      `[EventBus] Unsubscribing ${subscriber.getName()} from all events`
    );

    let unsubscribedCount = 0;

    for (const [eventType, subscribers] of this.subscribers.entries()) {
      const index = subscribers.indexOf(subscriber);

      if (index !== -1) {
        subscribers.splice(index, 1);
        unsubscribedCount++;

        this.logger.info(
          `[EventBus] ${subscriber.getName()} unsubscribed from ${eventType}`
        );

        if (subscribers.length === 0) {
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

  publish(event: IEvent): void {
    this.logger.info(`[EventBus] Publishing event: ${event.type}`);
    this.notifySubscribers(event.type, event);
  }

  private notifySubscribers(eventType: string, event: IEvent): void {
    const subscribers = this.subscribers.get(eventType);

    if (!subscribers || subscribers.length === 0) {
      this.logger.info(`[EventBus] No subscribers for ${eventType}`);
      return;
    }

    for (const subscriber of subscribers) {
      this.notifySubscriber(subscriber, eventType, event);
    }
  }

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
      throw error;
    }
  }

  clearSubscriptions(): void {
    this.subscribers.clear();
    this.logger.info(`[EventBus] Cleared all subscriptions`);
  }

 

  private isDuplicateSubscription(
    subscribers: ISubscriber[],
    subscriber: ISubscriber
  ): boolean {
    return subscribers.includes(subscriber);
  }
}
