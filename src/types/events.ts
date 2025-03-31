// src/types/events.ts
export interface IEvent {
  type: string;
  timestamp: Date;
  payload: any;
  token: string;
}

export interface StockLowEvent extends IEvent {
  type: "StockLow";
  payload: {
    productId: string;
    currentStock: number;
    threshold: number;
  };
}

export interface StockUpdatedEvent extends IEvent {
  type: "StockUpdated";
  payload: {
    productId: string;
    newStock: number;
  };
}

export interface ISubscriber {
  update(event: IEvent): void;
  getName(): string;
}
