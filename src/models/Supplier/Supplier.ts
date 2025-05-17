import { Address } from "./Address";
// Assignment Brief: Maintain basic supplier information, including contact details and order history
export class Supplier {
  constructor(
    private readonly id: string,
    private readonly name: string,
    private price: number,
    private contactDetails?: string,
    private orderHistory: string[] = []
  ) {}

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getPrice(): number {
    return this.price;
  }

  getContactDetails(): string | undefined {
    return this.contactDetails;
  }

  getOrderHistory(): string[] {
    return [...this.orderHistory];
  }

  setPrice(newPrice: number) {
    this.price = newPrice;
    console.log(`New price for supplier ${this.id}: ${newPrice}`);
  }

  setContactDetails(details: string | undefined) {
    this.contactDetails = details;
  }

  addOrder(orderId: string): void {
    if (!this.orderHistory.includes(orderId)) {
      this.orderHistory.push(orderId);
    }
  }
  removeOrder(orderId: string): boolean {
    const index = this.orderHistory.indexOf(orderId);
    if (index !== -1) {
      this.orderHistory.splice(index, 1);
      return true;
    }
    return false;
  }
}

export class ContactDetails {
  constructor(
    private readonly _email: string,
    private readonly _phone: string,
    private readonly _address: Address
  ) {}

  getEmail(): string {
    return this._email;
  }

  getPhone(): string {
    return this._phone;
  }

  getAddress(): Address {
    return this._address;
  }
}
