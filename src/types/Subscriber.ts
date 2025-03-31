// src/types/Subscriber.ts
import { IEvent } from "./events";

export interface ISubscriber {
  getName(): string;
  handleEvent(event: IEvent): void;
}
