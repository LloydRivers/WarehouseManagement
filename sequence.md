::: mermaid
sequenceDiagram
participant User
participant CLI
participant CustomerService
participant EventBus
participant InventoryService
participant FinancialReportService
participant SupplierService

    User->>CLI: Start app and choose option

    alt Place Order
        CLI->>CustomerService: placeOrder(orderDetails)
        Note right of CustomerService: this.orderRepository.save(order)
        CustomerService->>EventBus: publish CUSTOMER_ORDER_CREATED event

        EventBus->>InventoryService: notify CUSTOMER_ORDER_CREATED
        Note right of InventoryService: validateProduct(productId, quantity), reduceStock(quantity), update inventoryRepository, if stock low -> publish REORDER_STOCK event

        EventBus->>SupplierService: notify REORDER_STOCK (if any)
        EventBus->>FinancialReportService: notify CUSTOMER_ORDER_CREATED

        CLI->>User: "Order placed successfully"
    else View Financial Report
        CLI->>FinancialReportService: getReport()
        FinancialReportService-->>CLI: report data
        CLI->>User: display report
    else Exit
        CLI->>User: exit
    end

:::
