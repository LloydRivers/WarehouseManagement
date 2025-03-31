export class PurchaseOrder {
  constructor(
    public id: string,
    public productId: string,
    public supplierId: string,
    public quantity: number,
    public status: "PENDING" | "ORDERED" | "SHIPPED" = "PENDING"
  ) {}

  // You can add more methods here to handle the purchase order status, delivery, etc.
}
