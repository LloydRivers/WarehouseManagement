// src/models/Customer.ts
import { IOrderHistory, IShippingAddress } from "../../types";
import { DomainError } from "../../utils/Error";
import { ValidationUtils } from "../../utils/ValidationUtils";

export class Customer {
  private email!: string;
  private orderHistory: IOrderHistory[] = [];

  constructor(
    public readonly id: string,
    public readonly name: string,
    email: string,
    private shippingAddress: IShippingAddress
  ) {
    this.setEmail(email);
  }

  getShippingAddress(): IShippingAddress {
    return this.shippingAddress;
  }

  getOrderHistory(): IOrderHistory[] {
    return this.orderHistory;
  }

  setEmail(newEmail: string): void {
    if (!ValidationUtils.validateEmail(newEmail)) {
      throw new DomainError("Invalid email format.");
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
