// Supplier.ts
import { IAddress, IOrderHistory, ISupplier } from "../types";
import { InvalidEmailError } from "../utils/Error";

// This class represents a supplier. The company name is marked as "readonly"
// because it should not change after instantiation. The contact person, email,
// phone number, and address can be updated in case of changes (e.g., employee changes).

export class Supplier implements ISupplier {
  private contactPerson: string;
  private email: string;
  private phoneNumber: string;
  private address: IAddress;
  private orderHistory: IOrderHistory[] = [];

  constructor(
    public readonly id: string,
    public readonly name: string,
    contactPerson: string,
    email: string,
    phoneNumber: string,
    address: IAddress
  ) {
    this.contactPerson = contactPerson;
    this.email = email;
    this.phoneNumber = phoneNumber;
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
    return this.phoneNumber;
  }

  getAddress(): IAddress {
    return this.address;
  }

  setContactPerson(newContactPerson: string): void {
    this.contactPerson = newContactPerson;
  }

  setEmail(newEmail: string): void {
    if (this.validateEmail(newEmail)) {
      this.email = newEmail;
    } else {
      throw new InvalidEmailError("Invalid email format.");
    }
  }

  setPhoneNumber(newPhoneNumber: string): void {
    if (this.validatePhoneNumber(newPhoneNumber)) {
      this.phoneNumber = newPhoneNumber;
    } else {
      throw new InvalidEmailError("Invalid phone number format.");
    }
  }

  setAddress(newAddress: IAddress): void {
    this.address = newAddress;
  }

  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private validatePhoneNumber(phoneNumber: string): boolean {
    const phoneRegex = /^[\d\s\+\-()]{8,20}$/;
    return phoneRegex.test(phoneNumber);
  }
}
