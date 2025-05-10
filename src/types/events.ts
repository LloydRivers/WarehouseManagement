// src/types/events.ts

export interface OrderProduct {
  productId: string;
  quantity: number;
}

export interface IEvent {
  type: string;
  payload: {
    products: OrderProduct[];
  };
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
