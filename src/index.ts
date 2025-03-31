// index.ts
import { ConcreteMix } from "./models/inventory/ConcreteMix";
import { Supplier } from "./models/Supplier/Supplier";
import { Customer } from "./models/Customer/Customer";
import { CustomerService } from "./services/CustomerService";
import { EventBus } from "./core/EventBus";

// Step 1: Create ONE supplier so complexity doesn't increase
const supplier1 = new Supplier(
  "supplier-123",
  "Concrete Suppliers Ltd.",
  "John Doe",
  "john@concretesuppliers.com",
  {
    street: "123 Concrete Ave.",
    city: "Concrete City",
    postalCode: "12345",
    country: "Concrete Country",
    phoneNumber: "123-456-7890",
  }
);

// Step 2: Create ONE product and associate it A supplier
const concrete = new ConcreteMix(
  "product-001",
  "Concrete Mix",
  "High-quality concrete mix for construction projects",
  "RAW_MATERIAL",
  100, // base price
  50, // current stock
  10, // minimum stock threshold
  [
    { supplier: supplier1, price: 120 }, // Supplier 1 linked
  ]
);

// Create ONE Customer class
const customer = new Customer("123", "John Doe", "customer@gmail.com", {
  street: "789 Customer St.",
  city: "Customer City",
  postalCode: "54321",
  country: "Customer Country",
  phoneNumber: "555-555-5555",
});

customer.placeOrder({
  orderId: "order-001",
  orderDate: new Date().toISOString(),
  products: [
    { productId: concrete.getId(), quantity: 2, price: concrete.getPrice() },
  ],
});

console.log("Customer Order History:", customer.getOrderHistory());
