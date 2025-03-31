// src/types/datasource.ts
import { Customer } from "../models/Customer/Customer";

export interface ICustomerDataSource {
  loadCustomers(): Customer[];
}
