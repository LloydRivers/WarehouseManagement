// src/types/subscriber.ts
import { EventMap, IEvent } from "./events";

export interface ISubscriber<K extends keyof EventMap = keyof EventMap> {
  getName(): string;
  handleEvent(event: IEvent<K>): void;
}
