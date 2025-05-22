::: mermaid
erDiagram
%% Data Sources
InMemoryCustomerDataSource {
Customer[] customers
Customer[] loadCustomers
}

    InMemoryProductDataSource {
        SupplierRepository supplierRepository
        Product[] loadProducts
    }

    InMemorySupplierDataSource {
        Supplier[] suppliers
        Supplier[] loadSuppliers

    }

    %% Repositories
    CustomerRepository {
        ICustomerDataSource dataSource
        Customer[] loadCustomers
        Customer getById
        void save
        void update
    }

    OrderRepository {
       CustomerOrder[] orders
       void save
       CustomerOrder[] getByCustomerId
       void update
    }

    InventoryRepository {
        InMemoryProductDataSource dataSource
        Product[] loadProducts
        Product getById
        void update
    }

    SupplierRepository {
        InMemorySupplierDataSource dataSource
        Supplier[] loadSuppliers
        Supplier getById
        void update
        void updateSupplierPrice
    }

    PurchaseOrderRepository {
        PurchaseOrder[] orders
        void save
        PurchaseOrder[] getBySupplierId
        void update
    }

    %% Services
    CustomerService {
        void placeOrder
        void publishCustomerOrderCreatedEvent
        void validateOrder
    }

    InventoryService {
        void handleEvent
        void processOrderCreatedEvent
        void publishReorderStockEvent
        Product validateProduct
    }

    SupplierService {
       boolean handleEvent
       boolean isReorderStockEvent
       string fetchProductAndSupplier
       PurchaseOrder createAndSavePurchaseOrder
       void replenishStockAndPublishEvent
       Supplier updateSupplier
    }

    FinancialReportService {
        void handleEvent
        FinancialReport getReport
    }

    %% Core Components
    EventBus {
        string id
        string subscribers
    }

    ConsoleLogger {
        string id
        string logLevel
    }

    %% Relationships - Data Sources to Repositories
    CustomerRepository ||--|| InMemoryCustomerDataSource : uses
    SupplierRepository ||--|| InMemorySupplierDataSource : uses
    InventoryRepository ||--|| InMemoryProductDataSource : uses
    InMemoryProductDataSource ||--|| SupplierRepository : depends-on

    %% Relationships - Services to Repositories
    CustomerService ||--|| CustomerRepository : uses
    CustomerService ||--|| OrderRepository : uses
    InventoryService ||--|| InventoryRepository : uses
    SupplierService ||--|| InventoryRepository : uses
    SupplierService ||--|| PurchaseOrderRepository : uses
    SupplierService ||--|| SupplierRepository : uses

    %% Relationships - Services to Core Components
    CustomerService ||--|| EventBus : publishes-to
    InventoryService ||--|| EventBus : subscribes-to
    InventoryService ||--|| ConsoleLogger : uses
    SupplierService ||--|| EventBus : subscribes-to
    SupplierService ||--|| ConsoleLogger : uses
    FinancialReportService ||--|| EventBus : subscribes-to
    FinancialReportService ||--|| ConsoleLogger : uses

    %% Core Component Relationships
    EventBus ||--|| ConsoleLogger : uses

:::
