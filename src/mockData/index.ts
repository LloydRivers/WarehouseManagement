// mockData.ts
import { Supplier } from "../models/Supplier/Supplier";
import { ConcreteMix } from "../models/inventory/ConcreteMix";

// Mock Suppliers
export const suppliers = [
  new Supplier(
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
  ),
  new Supplier(
    "supplier-456",
    "Plastics Suppliers Ltd.",
    "Jane Smith",
    "jane@plasticssuppliers.com",
    {
      street: "456 Plastics St.",
      city: "Plastics City",
      postalCode: "67890",
      country: "Plastics Country",
      phoneNumber: "987-654-3210",
    }
  ),
];

// Mock Products
export const products = [
  new ConcreteMix(
    "product-001",
    "Concrete Mix",
    "High-quality concrete mix",
    "RAW_MATERIAL",
    100, // base price
    50, // stock
    10, // min stock threshold
    [
      { supplier: suppliers[0], price: 120 },
      { supplier: suppliers[1], price: 110 },
    ]
  ),
];
