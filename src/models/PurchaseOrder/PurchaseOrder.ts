// models/PurchaseOrder.ts
export enum PurchaseOrderStatus {
  Pending = "Pending",
  Approved = "Approved",
  Delivered = "Delivered",
  Canceled = "Canceled",
}

export interface PurchaseOrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export class PurchaseOrder {
  constructor(
    private readonly id: string,
    private readonly supplierId: string,
    private readonly orderDate: string,
    private items: PurchaseOrderItem[],
    private status: PurchaseOrderStatus = PurchaseOrderStatus.Pending
  ) {}

  getId(): string {
    return this.id;
  }

  getSupplierId(): string {
    return this.supplierId;
  }

  getOrderDate(): string {
    return this.orderDate;
  }

  getItems(): PurchaseOrderItem[] {
    return [...this.items];
  }

  getStatus(): PurchaseOrderStatus {
    return this.status;
  }

  setStatus(newStatus: PurchaseOrderStatus) {
    this.status = newStatus;
  }

  getTotal(): number {
    return this.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );
  }
}
