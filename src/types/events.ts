// src/types/events.ts

export interface EventMap {
  CustomerOrderCreated: {
    products: IOrderItem[];
  };
  ReorderStock: {
    products: IOrderItem[];
  };
  StockReplenished: {
    products: IOrderItem[];
  };
  TEST_EVENT: {
    products: IOrderItem[];
  };
  NO_SUBSCRIBERS_EVENT: {
    products: IOrderItem[];
  };
  FAIL_EVENT: {
    products: IOrderItem[];
  };
  EVENT_X: {
    products: IOrderItem[];
  };
  EVENT_Y: {
    products: IOrderItem[];
  };
  NON_EXISTENT_EVENT: {
    products: IOrderItem[];
  };
  SINGLE_EVENT: {
    products: IOrderItem[];
  };
  SHARED_EVENT: {
    products: IOrderItem[];
  };
  EVENT_A: {
    products: IOrderItem[];
  };
  EVENT_B: {
    products: IOrderItem[];
  };
  EVENT_TYPE: {
    products: IOrderItem[];
  };
  ["SPECIAL_EVENT@123"]: {
    products: IOrderItem[];
  };
  EVENT_1: {
    products: IOrderItem[];
  };
  EVENT_2: {
    products: IOrderItem[];
  };
  EVENT_3: {
    products: IOrderItem[];
  };
}

export interface IOrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface IEvent<K extends keyof EventMap = keyof EventMap> {
  type: K;
  payload: EventMap[K];
}

export const EVENT_TYPES = {
  CUSTOMER_ORDER_CREATED: "CustomerOrderCreated",
  REORDER_STOCK: "ReorderStock",
  STOCK_REPLENISHED: "StockReplenished",
} as const;
