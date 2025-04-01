// src/models/Customer.ts
import { IShippingAddress } from "../../types";
import { DomainError } from "../../utils/Error";
import { ValidationUtils } from "../../utils/ValidationUtils";

export class Customer {
  private email!: string;

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

  setEmail(newEmail: string): void {
    if (!ValidationUtils.validateEmail(newEmail)) {
      throw new DomainError("Invalid email format.");
    }
    this.email = newEmail;
  }

  getEmail(): string {
    return this.email;
  }
}
