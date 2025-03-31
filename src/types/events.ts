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
    productId: string;
    quantity: number;
  };
}

export interface StockUpdatedEvent extends IEvent {
  type: "StockUpdated";
  payload: {
    productId: string;
    newQuantity: number;
  };
}
export interface InventoryLowEvent extends IEvent {
  type: "InventoryLow";
  payload: {
    productId: string;
    quantity: number;
  };
}
