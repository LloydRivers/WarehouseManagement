// src/types/events.ts

export interface IEvent {
  type: string;
  payload: unknown;
}

export interface CustomerOrderCreatedEvent extends IEvent {
  type: "CustomerOrderCreated";
  payload: {
    customerId: string;
    orderId: string;
    products: { productId: string; quantity: number }[];
  };
}

export const EVENT_TYPES = {
  CUSTOMER_ORDER_CREATED: "CustomerOrderCreated",
} as const;
