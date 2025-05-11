// src/types/events.ts

export interface EventMap {
  CustomerOrderCreated: {
    products: OrderProduct[];
  };
  ReorderStock: {
    products: OrderProduct[];
  };
  StockReplenished: {
    products: StockProduct[];
  };
  TEST_EVENT: {
    products: OrderProduct[];
  };
  NO_SUBSCRIBERS_EVENT: {
    products: OrderProduct[];
  };
  FAIL_EVENT: {
    products: OrderProduct[];
  };
  EVENT_X: {
    products: OrderProduct[];
  };
  EVENT_Y: {
    products: OrderProduct[];
  };
  NON_EXISTENT_EVENT: {
    products: OrderProduct[];
  };
  SINGLE_EVENT: {
    products: OrderProduct[];
  };
  SHARED_EVENT: {
    products: OrderProduct[];
  };
  EVENT_A: {
    products: OrderProduct[];
  };
  EVENT_B: {
    products: OrderProduct[];
  };
  EVENT_TYPE: {
    products: OrderProduct[];
  };
  ["SPECIAL_EVENT@123"]: {
    products: OrderProduct[];
  };
  EVENT_1: {
    products: OrderProduct[];
  };
  EVENT_2: {
    products: OrderProduct[];
  };
  EVENT_3: {
    products: OrderProduct[];
  };
}
export interface StockProduct extends OrderProduct {
  unitCost: number;
}
export interface OrderProduct {
  productId: string;
  quantity: number;
}

export interface IEvent<K extends keyof EventMap = keyof EventMap> {
  type: K;
  payload: EventMap[K];
}

export interface CustomerOrderCreatedEvent extends IEvent {
  type: "CustomerOrderCreated";
  payload: {
    customerId: string;
    orderId: string;
    products: OrderProduct[];
  };
}

export const EVENT_TYPES = {
  CUSTOMER_ORDER_CREATED: "CustomerOrderCreated",
  REORDER_STOCK: "ReorderStock",
  STOCK_REPLENISHED: "StockReplenished",
} as const;
