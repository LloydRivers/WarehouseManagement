import { IOrderItem } from "../../types";

export class CustomerOrder {
  constructor(
    public id: string,
    public customerId: string,
    public orderDate: Date = new Date(),
    public orderItems: IOrderItem[],
    public status: "PENDING" | "PROCESSED" | "SHIPPED" | "CANCELLED" = "PENDING"
  ) {}

  // Calculate total order amount
  get totalAmount(): number {
    return this.orderItems.reduce(
      (total, item) => total + item.quantity * item.unitPrice,
      0
    );
  }

  // Update order status
  updateStatus(
    newStatus: "PENDING" | "PROCESSED" | "SHIPPED" | "CANCELLED"
  ): void {
    this.status = newStatus;
  }
}
