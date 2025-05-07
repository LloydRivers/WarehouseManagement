// mockData.ts
import { Supplier } from "../models/Supplier/Supplier";
import { ConcreteMix } from "../models/inventory/ConcreteMix";

// Mock Suppliers
export const suppliers = [
  new Supplier("Supplier-1", "Concrete Suppliers Inc."),
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
    [{ supplier: suppliers[0], price: 120 }]
  ),
];
