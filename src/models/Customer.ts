// src/models/Customer.ts
import { IOrderHistory, IShippingAddress } from "../types";
import { InvalidEmailError } from "../utils/Error";
import { ValidationUtils } from "../utils/ValidationUtils";

export class Customer {
  private email: string;
  private shippingAddresses: IShippingAddress[] = [];
  private orderHistory: IOrderHistory[] = [];

  constructor(
    public readonly id: string,
    public readonly name: string,
    email: string
  ) {
    this.email = email;
  }

  addShippingAddress(address: IShippingAddress): void {
    this.shippingAddresses.push(address);
  }

  getShippingAddresses(): IShippingAddress[] {
    return this.shippingAddresses;
  }

  getOrderHistory(): IOrderHistory[] {
    return this.orderHistory;
  }

  setEmail(newEmail: string): void {
    if (!ValidationUtils.validateEmail(newEmail)) {
      throw new InvalidEmailError("Invalid email format.");
    }
    this.email = newEmail;
  }

  placeOrder(order: IOrderHistory): void {
    this.orderHistory.push(order);
  }

  getEmail(): string {
    return this.email;
  }
}
