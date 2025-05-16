# Warehouse Management System

### 🧠 CLI Flow

```
Warehouse Management System
1. Place Order
2. View Financial Report
3. Exit
```

When placing an order, the following happens:

- User inputs customer ID, product ID, and quantity.
- The order is processed through CustomerService.
- EventBus notifies all subscribers (InventoryService, FinancialReportService, etc.).
- The inventory is updated, and financial data is recalculated.

### 🧪 Example Event Chain

```
> Enter Product ID: product-001
> Enter Quantity: 45
```

Triggers:

1. `CUSTOMER_ORDER_CREATED`
   - Reduces inventory
   - Records sales revenue
2. If inventory < threshold:
   - `REORDER_STOCK`
   - Triggers stock replenishment
   - Records purchase cost
3. `STOCK_REPLENISHED`
   - Updates stock
   - Updates financial report

### 📁 Project Structure

```
.
├── core/                 # Core utilities (EventBus, interfaces)
├── loader/               # In-memory data loaders
├── repository/           # Repositories for Customer, Inventory, Orders
├── services/             # Domain logic (Customer, Inventory, Financial, Supplier)
├── types/                # Event and domain type declarations
├── utils/                # Logging, helpers
└── index.ts              # CLI entry point
```

### 📊 Financial Reporting Example

```
=== Financial Report ===
Total Sales: £900
Total Purchases: £450
Net Income: £450
```

Note: Values are computed dynamically based on emitted events and stored state.

### 📌 Tech Stack

- **Language**: TypeScript
- **Architecture**: Event-driven, Modular, OOP
- **Runtime**: Node.js
- **Storage**: In-memory only (for simulation purposes)

### 🧠 Educational Value

This project was built with a strict learning philosophy:

> "Don't hand over code—force deep ownership of the logic."

Every architectural decision was made to reinforce a mental model of modern backend systems. Debugging, event tracing, and state management are done by thinking like the system, not just reading code.

### 🧑‍💻 Author Notes

This project was built entirely from scratch with zero scaffolding. Every class, event, and interface was handcrafted to strengthen understanding of:

- Real-world software architecture
- Decoupled systems via event buses
- The power of ownership in engineering logic

It's not just code—it's a thinking exercise in building maintainable, scalable systems.
