// src/services/SupplierService.ts

import { InventoryRepository } from "../repository/InventoryRepository";
import { IEvent } from "../types/events";
import { ConsoleLogger } from "../utils/Logger";
import { EventBus } from "../core/EventBus";
import { PurchaseOrderRepository } from "../repository/PurchaseOrderRepository";
import { SupplierRepository } from "../repository/SupplierRepository";
import {
  PurchaseOrder,
  PurchaseOrderStatus,
} from "../models/PurchaseOrder/PurchaseOrder";
import { Supplier } from "../models/Supplier/Supplier";
import { Product } from "../models/inventory/Product";
import { DomainError } from "../utils/Error";

export class SupplierService {
  constructor(
    private logger: ConsoleLogger,
    private inventoryRepository: InventoryRepository,
    private eventBus: EventBus,
    private purchaseOrderRepository: PurchaseOrderRepository,
    private supplierRepository: SupplierRepository
  ) {}

  getName(): string {
    return "SupplierService";
  }

  handleEvent(event: IEvent): boolean {
    if (!this.isReorderStockEvent(event)) {
      this.logger.warn(`Ignoring event type: ${event.type}`);
      return false;
    }

    try {
      const { productId, quantity, unitPrice } = event.payload.products[0];
      const { product, supplier } = this.fetchProductAndSupplier(productId);

      const purchaseOrder = this.createAndSavePurchaseOrder(
        supplier.getId(),
        productId,
        quantity,
        unitPrice
      );

      supplier.addOrder(purchaseOrder.getId());
      this.supplierRepository.update(supplier);

      this.replenishStockAndPublishEvent(product, quantity);

      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  private isReorderStockEvent(event: IEvent): boolean {
    return event.type === "ReorderStock";
  }

  private fetchProductAndSupplier(productId: string): {
    product: Product;
    supplier: Supplier;
  } {
    const product = this.inventoryRepository.getById(productId);
    if (!product) {
      throw new DomainError(
        `Product not found for reorder: ${productId}. Cannot replenish stock.`
      );
    }

    const supplier = this.supplierRepository.getById(product.getSupplierId());
    if (!supplier) {
      throw new DomainError(
        `Supplier not found for product: ${productId}. Cannot replenish stock.`
      );
    }

    return { product, supplier };
  }
  // Assignment Brief: Create a purchase order with the supplier and product details
  private createAndSavePurchaseOrder(
    supplierId: string,
    productId: string,
    quantity: number,
    unitPrice: number
  ): PurchaseOrder {
    const purchaseOrder = new PurchaseOrder(
      `po-${Date.now()}`,
      supplierId,
      new Date().toISOString(),
      [{ productId, quantity, unitPrice }],
      PurchaseOrderStatus.Pending
    );

    this.purchaseOrderRepository.save(purchaseOrder);
    return purchaseOrder;

    // Only this code is untested so far
    // Only this code is untested so far
    // Only this code is untested so far
  }

  private replenishStockAndPublishEvent(
    product: Product,
    quantity: number
  ): void {
    product.replenishToFullStock();
    this.inventoryRepository.update(product);

    this.eventBus.publish({
      type: "StockReplenished",
      payload: {
        products: [
          {
            productId: product.getId(),
            quantity,
            unitPrice: product.getBasePrice(),
          },
        ],
      },
    });
  }
  // Assignment Brief: Implement features to add, update, and delete supplier records.
  updateSupplier(updatedSupplier: Supplier): void {
    const existingSupplier = this.supplierRepository.getById(
      updatedSupplier.getId()
    );
    if (!existingSupplier) {
      throw new DomainError(
        `Cannot update non-existent supplier with ID ${updatedSupplier.getId()}`
      );
    }
    this.supplierRepository.update(updatedSupplier);

    this.logger.info(
      `Supplier ${updatedSupplier.getId()} updated successfully.`
    );
  }
}
