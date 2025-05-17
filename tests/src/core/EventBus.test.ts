// tests/src/core/EventBus.test.ts
import { vi } from "vitest";
import { EventBus } from "../../../src/core/EventBus";
import { ConsoleLogger } from "../../../src/utils/Logger";
import { ISubscriber } from "../../../src/types/subscriber";

describe("EventBus", () => {
  let eventBus: EventBus;
  let mockLogger: ConsoleLogger;

  beforeEach(() => {
    mockLogger = {
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    } as unknown as ConsoleLogger;

    eventBus = new EventBus(mockLogger);
  });

  it("handles duplicate subscriptions (should warn and not duplicate)", () => {
    const subscriber: ISubscriber = {
      getName: vi.fn(() => "TestSubscriber"),
      handleEvent: vi.fn(),
    };
    eventBus.subscribe("TEST_EVENT", subscriber);
    expect(mockLogger.info).toHaveBeenCalledWith(
      "[EventBus] TestSubscriber subscribed to TEST_EVENT"
    );

    eventBus.subscribe("TEST_EVENT", subscriber);
    expect(mockLogger.warn).toHaveBeenCalledWith(
      "[EventBus] TestSubscriber is already subscribed to TEST_EVENT"
    );

    eventBus.publish({
      type: "TEST_EVENT",
      payload: {
        products: [{ productId: "1", quantity: 10, unitPrice: 100 }],
      },
    });
    expect(mockLogger.info).toHaveBeenCalledWith(
      "[EventBus] Publishing event: TEST_EVENT"
    );

    expect(subscriber.handleEvent).toHaveBeenCalledTimes(1);
    expect(eventBus.getSubscribers("TEST_EVENT")).toHaveLength(1);
  });

  it("publishes events with no subscribers", () => {
    eventBus.publish({
      type: "NO_SUBSCRIBERS_EVENT",
      payload: {
        products: [{ productId: "1", quantity: 10, unitPrice: 100 }],
      },
    });
    expect(mockLogger.info).toHaveBeenCalledWith(
      "[EventBus] Publishing event: NO_SUBSCRIBERS_EVENT"
    );
    expect(mockLogger.info).toHaveBeenCalledWith(
      "[EventBus] No subscribers for NO_SUBSCRIBERS_EVENT"
    );
  });

  it("throws and logs an error when a subscriber fails to handle an event", () => {
    const failingSubscriber: ISubscriber = {
      getName: vi.fn(() => "FailingSubscriber"),
      handleEvent: vi.fn(() => {
        throw new Error("Failed to handle event");
      }),
    };
    eventBus.subscribe("FAIL_EVENT", failingSubscriber);
    try {
      eventBus.publish({
        type: "FAIL_EVENT",
        payload: {
          products: [{ productId: "1", quantity: 10, unitPrice: 100 }],
        },
      });
    } catch (error) {
      expect(mockLogger.error).toHaveBeenCalledWith(
        "[EventBus] Error notifying FailingSubscriber about FAIL_EVENT: Failed to handle event"
      );
    }
  });

  it("returns false and logs a warning if trying to unsubscribe a subscriber that was never subscribed", () => {
    const subscriber: ISubscriber = {
      getName: vi.fn(() => "GhostSubscriber"),
      handleEvent: vi.fn(),
    };

    eventBus.subscribe("EVENT_X", subscriber);
    eventBus.unsubscribe("EVENT_X", subscriber);

    const result = eventBus.unsubscribe("EVENT_X", subscriber);

    expect(result).toBe(false);
    expect(mockLogger.info).toHaveBeenCalledWith(
      "[EventBus] Attempting to unsubscribe GhostSubscriber from EVENT_X"
    );
    expect(mockLogger.warn).toHaveBeenCalledWith(
      "[EventBus] Cannot unsubscribe GhostSubscriber from EVENT_X: no subscribers exist"
    );
  });

  it("unsubscribes from an event type that doesn't exist", () => {
    const subscriber: ISubscriber = {
      getName: vi.fn(() => "NonExistentEventSubscriber"),
      handleEvent: vi.fn(),
    };

    eventBus.subscribe("EVENT_Y", subscriber);
    eventBus.unsubscribe("NON_EXISTENT_EVENT", subscriber);

    expect(mockLogger.info).toHaveBeenCalledWith(
      "[EventBus] Attempting to unsubscribe NonExistentEventSubscriber from NON_EXISTENT_EVENT"
    );
    expect(mockLogger.warn).toHaveBeenCalledWith(
      "[EventBus] Cannot unsubscribe NonExistentEventSubscriber from NON_EXISTENT_EVENT: no subscribers exist"
    );
    expect(eventBus.getSubscribers("EVENT_Y")).toHaveLength(1);
    expect(eventBus.getSubscribers("NON_EXISTENT_EVENT")).toHaveLength(0);
  });

  it("removes empty subscriber lists after unsubscribing", () => {
    const subscriber: ISubscriber = {
      getName: vi.fn(() => "SoloSubscriber"),
      handleEvent: vi.fn(),
    };

    eventBus.subscribe("SINGLE_EVENT", subscriber);
    const result = eventBus.unsubscribe("SINGLE_EVENT", subscriber);

    expect(result).toBe(true);
    expect(mockLogger.info).toHaveBeenCalledWith(
      "[EventBus] Attempting to unsubscribe SoloSubscriber from SINGLE_EVENT"
    );
    expect(mockLogger.info).toHaveBeenCalledWith(
      "[EventBus] SoloSubscriber unsubscribed from SINGLE_EVENT"
    );
    expect(mockLogger.info).toHaveBeenCalledWith(
      "[EventBus] Removed empty subscriber list for SINGLE_EVENT"
    );
    expect(eventBus.getSubscribers("SINGLE_EVENT")).toHaveLength(0);
  });

  it("handles multiple subscribers for the same event", () => {
    const subscriberOne: ISubscriber = {
      getName: vi.fn(() => "SubscriberOne"),
      handleEvent: vi.fn(),
    };

    const subscriberTwo: ISubscriber = {
      getName: vi.fn(() => "SubscriberTwo"),
      handleEvent: vi.fn(),
    };

    eventBus.subscribe("SHARED_EVENT", subscriberOne);
    eventBus.subscribe("SHARED_EVENT", subscriberTwo);

    eventBus.publish({
      type: "SHARED_EVENT",
      payload: {
        products: [{ productId: "1", quantity: 10, unitPrice: 100 }],
      },
    });

    expect(subscriberOne.handleEvent).toHaveBeenCalledTimes(1);
    expect(subscriberTwo.handleEvent).toHaveBeenCalledTimes(1);

    expect(mockLogger.info).toHaveBeenCalledWith(
      "[EventBus] Notifying SubscriberOne about SHARED_EVENT"
    );
    expect(mockLogger.info).toHaveBeenCalledWith(
      "[EventBus] Notifying SubscriberTwo about SHARED_EVENT"
    );
  });

  it("handles a single subscriber for multiple event types", () => {
    const subscriber: ISubscriber = {
      getName: vi.fn(() => "MultiEventSubscriber"),
      handleEvent: vi.fn(),
    };

    eventBus.subscribe("EVENT_A", subscriber);
    eventBus.subscribe("EVENT_B", subscriber);

    eventBus.publish({
      type: "EVENT_A",
      payload: {
        products: [{ productId: "1", quantity: 10, unitPrice: 100 }],
      },
    });
    eventBus.publish({
      type: "EVENT_B",
      payload: {
        products: [{ productId: "1", quantity: 10, unitPrice: 100 }],
      },
    });

    expect(subscriber.handleEvent).toHaveBeenCalledTimes(2);
    expect(subscriber.handleEvent).toHaveBeenCalledWith({
      type: "EVENT_A",
      payload: {
        products: [{ productId: "1", quantity: 10, unitPrice: 100 }],
      },
    });
    expect(subscriber.handleEvent).toHaveBeenCalledWith({
      type: "EVENT_B",
      payload: {
        products: [{ productId: "1", quantity: 10, unitPrice: 100 }],
      },
    });
  });

  it("tests performance with a large number of subscribers and events", () => {
    const NUM_SUBSCRIBERS = 1000;
    const EVENT_TYPES = ["EVENT_1", "EVENT_2", "EVENT_3"];
    const EXPECTED_CALLS_PER_SUBSCRIBER = EVENT_TYPES.length;
    const subscribers = [];

    for (let i = 0; i < NUM_SUBSCRIBERS; i++) {
      const subscriber: ISubscriber = {
        getName: vi.fn(() => `Subscriber${i}`),
        handleEvent: vi.fn(),
      };
      subscribers.push(subscriber);
      EVENT_TYPES.forEach((eventType) =>
        // @ts-ignore
        eventBus.subscribe(eventType, subscriber)
      );
    }

    EVENT_TYPES.forEach((eventType) => {
      eventBus.publish({
        // @ts-ignore
        type: eventType,
        payload: {
          products: [{ productId: "1", quantity: 10, unitPrice: 100 }],
        },
      });
    });

    subscribers.forEach((subscriber) => {
      expect(subscriber.handleEvent).toHaveBeenCalledTimes(
        EXPECTED_CALLS_PER_SUBSCRIBER
      );
    });
  });

  it("handles case sensitivity in event type strings", () => {
    const subscriber: ISubscriber = {
      getName: vi.fn(() => "Subscriber1"),
      handleEvent: vi.fn(),
    };

    eventBus.subscribe("EVENT_TYPE", subscriber);

    eventBus.publish({
      type: "EVENT_TYPE",
      payload: {
        products: [{ productId: "1", quantity: 10, unitPrice: 100 }],
      },
    });
    eventBus.publish({
      // @ts-ignore
      type: "event_type",
      payload: {
        products: [{ productId: "1", quantity: 10, unitPrice: 100 }],
      },
    });

    expect(subscriber.handleEvent).toHaveBeenCalledTimes(1);
  });

  it("cleans up subscriber arrays to avoid memory leaks", () => {
    const subscriber: ISubscriber = {
      getName: vi.fn(() => "Subscriber1"),
      handleEvent: vi.fn(),
    };

    eventBus.subscribe("EVENT_TYPE", subscriber);

    eventBus.publish({
      type: "EVENT_TYPE",
      payload: {
        products: [{ productId: "1", quantity: 10, unitPrice: 100 }],
      },
    });
    expect(subscriber.handleEvent).toHaveBeenCalledTimes(1);

    eventBus.unsubscribe("EVENT_TYPE", subscriber);

    eventBus.publish({
      type: "EVENT_TYPE",
      payload: {
        products: [{ productId: "1", quantity: 10, unitPrice: 100 }],
      },
    });
    expect(subscriber.handleEvent).toHaveBeenCalledTimes(1);
  });

  it("handles special characters in event type names", () => {
    const subscriber: ISubscriber = {
      getName: vi.fn(() => "Subscriber1"),
      handleEvent: vi.fn(),
    };

    eventBus.subscribe("SPECIAL_EVENT@123", subscriber);

    eventBus.publish({
      type: "SPECIAL_EVENT@123",
      payload: {
        products: [{ productId: "1", quantity: 10, unitPrice: 100 }],
      },
    });

    expect(subscriber.handleEvent).toHaveBeenCalledTimes(1);
  });
});
