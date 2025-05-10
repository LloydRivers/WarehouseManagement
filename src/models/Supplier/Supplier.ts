export class Supplier {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public price: number,
    public contactDetails?: string, // optional contact details
    public orderHistory?: string[] // optional order history
  ) {}

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  // Optionally add more methods to interact with contact details and order history if needed
  getContactDetails(): string | undefined {
    return this.contactDetails;
  }

  getOrderHistory(): string[] | undefined {
    return this.orderHistory;
  }

  setPrice(newPrice: number): void {
    this.price = newPrice;
    console.log(`New price for supplier ${this.id}: ${newPrice}`);
  }
}
