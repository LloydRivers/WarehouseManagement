// src/models/Supplier.ts
import { IAddress, IOrderHistory, ISupplier } from "../../types";
import { DomainError } from "../../utils/Error";
import { ValidationUtils } from "../../utils/ValidationUtils";

// This class represents a supplier. The company name is marked as "readonly"
// because it should not change after instantiation. The contact person and email,
// can be updated in case of changes (e.g., employee leaves the company).

export class Supplier implements ISupplier {
  private contactPerson: string;
  private email: string;
  private address: IAddress;
  private orderHistory: IOrderHistory[] = [];

  constructor(
    public readonly id: string,
    public readonly name: string,
    contactPerson: string,
    email: string,
    address: IAddress
  ) {
    this.contactPerson = contactPerson;
    this.email = email;
    this.address = address;
  }

  addOrderHistory(order: IOrderHistory): void {
    this.orderHistory.push(order);
  }

  getOrderHistory(): IOrderHistory[] {
    return this.orderHistory;
  }

  getContactPerson(): string {
    return this.contactPerson;
  }

  getEmail(): string {
    return this.email;
  }

  getPhoneNumber(): string {
    return this.address.phoneNumber;
  }

  getAddress(): IAddress {
    return this.address;
  }

  setContactPerson(newContactPerson: string): void {
    this.contactPerson = newContactPerson;
  }

  setEmail(newEmail: string): void {
    if (!ValidationUtils.validateEmail(newEmail)) {
      throw new DomainError("Invalid email format.");
    }
    this.email = newEmail;
  }

  setPhoneNumber(newPhoneNumber: string): void {
    if (!ValidationUtils.validatePhoneNumber(newPhoneNumber)) {
      throw new Error("Invalid phone number format.");
    }
    this.address = { ...this.address, phoneNumber: newPhoneNumber };
  }

  setAddress(newAddress: IAddress): void {
    this.address = newAddress;
  }
}
