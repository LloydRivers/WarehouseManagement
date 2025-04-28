// src/types/datasource.ts
import { Customer } from "../models/Customer/Customer";
import { Product } from "../models/inventory/Product";

export interface ICustomerDataSource {
  loadCustomers(): Customer[];
}
export interface IProductDataSource {
  loadProducts(): Product[];
}
