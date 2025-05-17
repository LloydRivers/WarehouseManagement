// app.ts

import { InMemoryCustomerDataSource } from "./loader/InMemoryCustomerDataSource";
import { InMemoryProductDataSource } from "./loader/InMemoryProductDataSource";
import { InMemorySupplierDataSource } from "./loader/InMemorySupplierRepository";

import { CustomerRepository } from "./repository/CustomerRepository";
import { OrderRepository } from "./repository/OrderRepository";
import { InventoryRepository } from "./repository/InventoryRepository";
import { SupplierRepository } from "./repository/SupplierRepository";
import { PurchaseOrderRepository } from "./repository/PurchaseOrderRepository";

import { CustomerService } from "./services/CustomerService";
import { InventoryService } from "./services/InventoryService";
import { SupplierService } from "./services/SupplierService";
import { FinancialReportService } from "./services/FinancialReportService";

import { ConsoleLogger } from "./utils/Logger";
import { EventBus } from "./core/EventBus";
import { EVENT_TYPES } from "./types/events";

export function createApp() {
  const logger = new ConsoleLogger();
  const eventBus = new EventBus(logger);

  const customerRepository = new CustomerRepository(
    new InMemoryCustomerDataSource()
  );
  const supplierRepository = new SupplierRepository(
    new InMemorySupplierDataSource()
  );
  const inventoryRepository = new InventoryRepository(
    new InMemoryProductDataSource(supplierRepository)
  );
  const purchaseOrderRepository = new PurchaseOrderRepository();
  const orderRepository = new OrderRepository();

  const customerService = new CustomerService(
    customerRepository,
    orderRepository,
    eventBus
  );
  const inventoryService = new InventoryService(
    logger,
    inventoryRepository,
    eventBus
  );
  const supplierService = new SupplierService(
    logger,
    inventoryRepository,
    eventBus,
    purchaseOrderRepository,
    supplierRepository
  );
  const financialReportService = new FinancialReportService(logger);

  eventBus.subscribe(EVENT_TYPES.CUSTOMER_ORDER_CREATED, inventoryService);
  eventBus.subscribe(
    EVENT_TYPES.CUSTOMER_ORDER_CREATED,
    financialReportService
  );
  eventBus.subscribe(EVENT_TYPES.REORDER_STOCK, supplierService);
  eventBus.subscribe(EVENT_TYPES.STOCK_REPLENISHED, financialReportService);

  return {
    customerService,
    financialReportService,
  };
}
