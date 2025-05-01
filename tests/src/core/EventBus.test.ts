// tests/src/core/EventBus.test.ts
/**
 * Edge Cases and Robustness Tests

Test handling duplicate subscriptions (should warn and not duplicate)
Test publishing events with no subscribers
Test error handling when a subscriber throws an exception during event handling
Test unsubscribing a subscriber that was never subscribed
Test unsubscribing from an event type that doesn't exist
Test that empty subscriber lists are removed after unsubscribing
Test behavior with multiple subscribers for the same event
Test behavior with a single subscriber for multiple event types
Test performance with a large number of subscribers and events

Specific Edge Cases to Consider


Handling malformed events or invalid event types
Case sensitivity in event type strings
Proper cleanup of subscriber arrays to avoid memory leaks
Special characters in event type names
Handling of null or undefined values passed as parameters
Circular dependencies between subscribers
 * 
 */
import { vi } from "vitest";
import { EventBus } from "../../../src/core/EventBus";
import { ConsoleLogger } from "../../../src/utils/Logger";
import { ISubscriber } from "../../../src/types/subscriber";
import { InventoryService } from "../../../src/services/InventoryService";

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

    eventBus.publish({ type: "TEST_EVENT", payload: {} });
    expect(mockLogger.info).toHaveBeenCalledWith(
      "[EventBus] Publishing event: TEST_EVENT"
    );

    expect(subscriber.handleEvent).toHaveBeenCalledTimes(1);
    expect(eventBus.getSubscribers("TEST_EVENT")).toHaveLength(1);
  });

  it("publishes events with no subscribers", () => {
    eventBus.publish({ type: "NO_SUBSCRIBERS_EVENT", payload: {} });
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
      eventBus.publish({ type: "FAIL_EVENT", payload: {} });
    } catch (error) {
      expect(mockLogger.error).toHaveBeenCalledWith(
        "[EventBus] Error notifying FailingSubscriber about FAIL_EVENT: Failed to handle event"
      );
    }
  });

  it("unsubscribes a subscriber that was never subscribed", () => {
    const nonExistentSubscriber: ISubscriber = {
      getName: vi.fn(() => "NonExistentSubscriber"),
      handleEvent: vi.fn(),
    };
    const unsubscribedCount = eventBus.unsubscribe(
      "NON_EXISTENT_EVENT",
      nonExistentSubscriber
    );
    expect(mockLogger.info).toHaveBeenCalledWith(
      "[EventBus] Attempting to unsubscribe NonExistentSubscriber from NON_EXISTENT_EVENT"
    );
    expect(unsubscribedCount).toBe(0);
    expect(mockLogger.info).toHaveBeenCalledWith(
      "[EventBus] NonExistentSubscriber unsubscribed from 0 event types"
    );
  });

  it("unsubscribes from an event type that doesn't exist", () => {});
  it("removes empty subscriber lists after unsubscribing", () => {});
  it("handles multiple subscribers for the same event", () => {});
  it("handles a single subscriber for multiple event types", () => {});
  it("tests performance with a large number of subscribers and events", () => {});

  it("handles malformed events or invalid event types", () => {});
  it("handles case sensitivity in event type strings", () => {});
  it("cleans up subscriber arrays to avoid memory leaks", () => {});
  it("handles special characters in event type names", () => {});
  it("handles null or undefined values passed as parameters", () => {});
  it("handles circular dependencies between subscribers", () => {});
});
